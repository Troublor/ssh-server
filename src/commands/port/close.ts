import SshBase from "../../lib/ssh-base";
import {ContextLogger, Level} from "@troubkit/log";
import {Command} from "@troubkit/cmd";
import {getOrInstallSshpass} from "../../lib/sshpass";
import * as fs from "fs";
import * as child_process from "child_process";
import {genForwardSocket, parseForwardPattern} from "../../lib/port/helpers";
import * as path from "path";
import Config from "../../lib/config";

export default class PortClose extends SshBase {
    static description = "close ssh local port forwarding";
    static examples = [
        "$ ssh-server port:close remotePort:localPort ...",
    ];

    static flags = Object.assign(SshBase.flags, {});
    static args = [
        {
            name: "server",
            required: true,
            description: "name of server predefined in config file",
        },
        {
            name: "remotePort:localPort",
            required: true,
            description: "port forward pattern",
        },
    ];
    // this makes the parser not fail when it receives invalid arguments
    // defaults to true
    // set it to false if you need to accept variable arguments
    static strict = false;

    static logger = new ContextLogger("Port", Level.DEBUG);

    async run(): Promise<void> {
        const {argv, args, flags} = this.parse(PortClose);
        if (argv.length < 2) {
            throw new Error("at least two argument is required");
        }

        PortClose.logger.silent = flags.quiet;

        const config = super.parseServerConfig(args.server, flags);

        let cmd = new Command("ssh");

        if (config.identityFile) {
            cmd.append("-i", config.identityFile);

        } else if (config.password) {
            // auto input password with sshpass
            cmd = getOrInstallSshpass()
                .append(`-p '${config.password}'`)
                .append(cmd.toString());
        }
        cmd.append("-p", `${config.port ?? 22}`);

        for (const arg of argv.slice(1)) {
            try {
                const fw = parseForwardPattern(config, arg);
                PortClose.logger.info("Closing local port forwarding", {
                    local: fw.localStr,
                    remote: fw.remoteStr,
                });

                const fCmd = cmd.copy();

                const socket = genForwardSocket(fw);
                if (!fs.existsSync(path.join(Config.configDir, socket))) {
                    // the port is previously opened
                    PortClose.logger.warn("Local port forward is not opened", {
                        local: fw.localStr,
                        remote: fw.remoteStr,
                    });
                    continue;
                }
                fCmd.append("-S", socket);
                fCmd.append("-O exit");
                fCmd.append(`${config.username}@${config.host}`);

                PortClose.logger.debug(fCmd.toString());
                const r = child_process.spawnSync(fCmd.command, fCmd.args, {
                    stdio: "inherit",
                    env: process.env,
                    cwd: Config.configDir,
                });
                if (r.error) {
                    if (fs.existsSync(socket)) {
                        fs.unlinkSync(socket);
                    }
                    throw r.error;
                } else if (r.status != 0) {
                    if (fs.existsSync(socket)) {
                        fs.unlinkSync(socket);
                    }
                    throw new Error("process exit with code " + r.status);
                }
                PortClose.logger.info("Local port forwarding should be closed", {
                    local: fw.localStr,
                    remote: fw.remoteStr,
                });
            } catch (e) {
                PortClose.logger.error("Open local port forward failed", {err: e.message});
                PortClose.logger.trace("Open local port forward failed", {
                    err: e.message,
                    stack: e.stack,
                });
            }

        }
    }
}
