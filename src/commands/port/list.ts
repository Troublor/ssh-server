import SshBase from "../../lib/ssh-base";
import {ContextLogger, Level} from "@troubkit/log";
import {getOrInstallSshpass} from "../../lib/sshpass";
import {genForwardSocket, getCurrentlyOpeningForwards, parseForwardPattern} from "../../lib/port/helpers";
import * as fs from "fs";
import * as path from "path";
import Config from "../../lib/config";
import * as child_process from "child_process";
import {Command} from "@troubkit/cmd";

export default class PortList extends SshBase {
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
        const forwardPatterns = getCurrentlyOpeningForwards();
        for (const fw of forwardPatterns) {
            this.log(`${fw.remoteStr} -> ${fw.localStr}`);
        }
    }
}
