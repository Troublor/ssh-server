import SshBase from "../../lib/ssh-base";
import {Command} from "@troubkit/cmd";
import * as child_process from "child_process";
import {getOrInstallSshpass} from "../../lib/sshpass";
import * as fs from "fs";
import {genForwardSocket, parseForwardPattern} from "../../lib/port/helpers";
import {ContextLogger} from "@troubkit/log";
import Config from "../../lib/config";

export default class PortOpen extends SshBase {
    static description = "open ssh local port forwarding";
    static examples = [
        "$ ssh-server port:open localPort:remotePort ...",
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

    static logger = new ContextLogger("Port");

    async run(): Promise<void> {
        const {argv, args, flags} = this.parse(PortOpen);
        if (argv.length < 2) {
            throw new Error("at least two argument is required");
        }

        if (flags.quiet) {
            PortOpen.logger.silent = true;
        } else {
            PortOpen.logger.silent = false;
        }

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
                PortOpen.logger.info("Opening local port forwarding", {
                    local: fw.localStr,
                    remote: fw.remoteStr,
                });

                const fCmd = cmd.copy();

                fCmd.append("-fN -M");
                const socket = genForwardSocket(this.config.configDir, fw);
                if (fs.existsSync(socket)) {
                    // the port is previously opened
                    PortOpen.logger.warn("Local port forward has already been opened", {
                        local: fw.localStr,
                        remote: fw.remoteStr,
                    });
                    continue;
                }
                fCmd.append("-S", socket);
                fCmd.append(`-L ${fw.localAddress}:${fw.localPort}:${fw.remoteAddress}:${fw.remotePort}`);
                fCmd.append(`${config.username}@${config.host}`);

                PortOpen.logger.debug(fCmd.toString());
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
                PortOpen.logger.info("Local port forwarding should be opened", {
                    local: fw.localStr,
                    remote: fw.remoteStr,
                });
            } catch (e) {
                PortOpen.logger.error("Open local port forward failed", {err: e.message});
                PortOpen.logger.trace("Open local port forward failed", {
                    err: e.message,
                    stack: e.stack,
                });
            }
        }
    }
}
