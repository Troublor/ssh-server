import SshBase from "../lib/ssh-base";
import * as child_process from "child_process";
import {getOrInstallSshpass} from "../lib/sshpass";
import {Command} from "@troubkit/cmd";
import {ContextLogger} from "@troubkit/log";
import {flags} from "@oclif/command";

export default class Copy extends SshBase {
    static aliases = ["cp"];
    static description = "open server shell";
    static examples = [
        "$ ssh-server copy -r server:~/workspace ~/",
    ];

    static flags = Object.assign(SshBase.flags, {
        recursive: flags.boolean({char: "r", description: "recursive copy"}),
    });
    static args = [
        {name: "source"},
        {name: "..."},
        {name: "target"},
    ];

    static logger = new ContextLogger("Copy");

    async run(): Promise<void> {
        const {argv, flags} = this.parse(Copy);

        if (argv.length < 2) {
            console.log(Copy.help);
        }
        const sources = argv.slice(0, argv.length - 1);
        let target = argv[argv.length - 1];

        let cmd: Command = new Command("scp");
        if (flags.recursive) {
            cmd.append("-r");
        }
        const transformRemote = (remotePath: string, first: boolean): string | undefined => {
            const secs = remotePath.split(":");
            if (secs.length <= 1) {
                return undefined;
            }
            const server = secs[0];
            const config = super.parseServerConfig(server, flags);
            if (first) {
                if (config.identityFile) {
                    cmd.append("-i", config.identityFile as string);
                } else if (config.password) {
                    cmd = getOrInstallSshpass()
                        .append("-p", config.password)
                        .append(cmd.toString());
                }
                cmd.append("-P", `${config.port ?? 22}`);
            }

            return `${config.username}@${config.host}:${secs[1]}`;
        };
        let sourceRemote = false;
        let first = true;
        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            const transformed = transformRemote(source, first);
            if (transformed) {
                sources[i] = transformed;
                sourceRemote = true;
                first = false;
            }
        }
        let targetRemote = false;
        const transformed = transformRemote(target, first);
        if (transformed) {
            target = transformed;
            targetRemote = true;
        }
        if (sourceRemote && targetRemote) {
            cmd.append("-3");
        }
        cmd.append(...sources, target);
        console.log("$", cmd.toString());
        const r = child_process.spawnSync(cmd.command, cmd.args, {
            stdio: "inherit",
            env: process.env,
        });
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
