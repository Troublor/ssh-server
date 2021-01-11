import SshBase from "../lib/ssh-base";
import * as child_process from "child_process";
import {getOrInstallSshpass} from "../lib/sshpass";
import {Command} from "@troubkit/cmd";
import {ContextLogger} from "@troubkit/log";

export default class Shell extends SshBase {
    static description = "open server shell";
    static examples = [
        "$ ssh-server shell",
    ];

    static flags = SshBase.flags;
    static args = SshBase.args;

    static logger = new ContextLogger("Shell");

    async run(): Promise<void> {
        const {args, flags} = this.parse(Shell);

        const config = super.parseServerConfig(args as { [server: string]: string }[], flags);
        let r;
        if (config.keyFile) {
            Shell.logger.info("Connecting server " + config.name);
            r = child_process.spawnSync("ssh", [
                "-i", config.keyFile as string,
                "-p", `${config.port ?? 22}`,
                `${config.username}@${config.host}`,
            ], {
                stdio: "inherit",
                env: process.env,
            });

        } else if (config.password) {
            // auto input password with sshpass
            const cmd = getOrInstallSshpass();
            cmd.append(`-p '${config.password}' ssh ${config.username}@${config.host}`);
            cmd.append("-p", `${config.port ?? 22}`);
            Shell.logger.info("Connecting server " + config.name);
            r = child_process.spawnSync(cmd.command, cmd.args, {
                stdio: "inherit",
                env: process.env,
            });
        } else {
            // plain ssh
            Shell.logger.info("Connecting server " + config.name);
            const cmd = new Command(`ssh ${config.username}@${config.host}`);
            cmd.append("-p", `${config.port ?? 22}`);
            r = child_process.spawnSync(cmd.command, cmd.args, {
                stdio: "inherit",
                env: process.env,
            });
        }
        if (!r) {
            return;
        }
        if (r.error) {
            throw r.error;
        }
        if (r.status != 0) {
            throw new Error("process exit with code " + r.status);
        }
    }
}
