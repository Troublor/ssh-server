/// <reference types="../types" />

// this works as a proxy for the command to facilitate Alfred
import * as alfy from "alfy";
import {ScriptFilterJsonFormat} from "alfy";
import Config from "./lib/config";
import ConfigCommand from "./commands/config";

function buildShellCandidates(serverName?: string): ScriptFilterJsonFormat[] {
    const candidates: ScriptFilterJsonFormat[] = [];
    const servers = Config.loadServerConfigFile();
    for (const serverConfig of servers) {
        if (!serverName || serverConfig.name.startsWith(serverName)) {
            candidates.push({
                title: `open shell on remote server '${serverConfig.name}'`,
                subtitle: `ssh-server shell ${serverConfig.name}`,
                autocomplete: `shell ${serverConfig.name}`,
            });
        }
    }
    return candidates;
}

function buildCopyCandidates(): ScriptFilterJsonFormat[] {
    const candidates: ScriptFilterJsonFormat[] = [];
    candidates.push({
        title: "copy to/from remote server",
        subtitle: "ssh-server copy [serverName:]path/to/source [serverName:]path/to/destination",
        autocomplete: "copy ",
    });
    return candidates;
}

function buildPortCandidates(action?: "open" | "close", serverName?: string): ScriptFilterJsonFormat[] {
    const candidates: ScriptFilterJsonFormat[] = [];
    const servers = Config.loadServerConfigFile();
    if (!action) {
        candidates.push(
            {
                title: "open local port forwarding from remote server",
                subtitle: "Usage: port:open serverName remotePort:localPort",
                autocomplete: "port:open",
            },
            {
                title: "close local port forwarding from remote server",
                subtitle: "Usage: port:close serverName remotePort:localPort",
                autocomplete: "port:close",
            },
        );
    } else
        for (const serverConfig of servers) {
            if (!serverName || serverConfig.name.startsWith(serverName)) {
                candidates.push({
                    title: `${action} local port forwarding from remote server '${serverConfig.name}'`,
                    subtitle: `ssh-server port:${action} ${serverConfig.name}`,
                    autocomplete: `port:${action} ${serverConfig.name}`,
                });
            }
        }
    return candidates;
}

function getAlfredCandidates(args: string[]): ScriptFilterJsonFormat[] {
    if (args.length < 1) {
        return [];
    }
    const candidates: ScriptFilterJsonFormat[] = [];
    const cmd = args[0];
    if (!cmd) {
        candidates.push(
            {
                title: "open shell on remote server",
                subtitle: "Usage: shell serverName",
                autocomplete: "shell",
            },
            {
                title: "copy to/from remote server",
                subtitle: "Usage: copy [serverName:]path/to/source [serverName:]path/to/destination",
                autocomplete: "copy",
            },
            {
                title: "open local port forwarding from remote server",
                subtitle: "Usage: port:open serverName remotePort:localPort",
                autocomplete: "port:open",
            },
            {
                title: "close local port forwarding from remote server",
                subtitle: "Usage: port:close serverName remotePort:localPort",
                autocomplete: "port:close",
            },
        );
    } else if ("shell".startsWith(cmd)) {
        candidates.push(...buildShellCandidates(args[1]));
    } else if ("copy".startsWith(cmd) || "cp".startsWith(cmd)) {
        candidates.push(...buildCopyCandidates());
    } else if ("port".startsWith(cmd)) {
        candidates.push(...buildPortCandidates());
    } else if ("port:open".startsWith(cmd)) {
        candidates.push(...buildPortCandidates("open", args[1]));
    } else if ("port:close".startsWith(cmd)) {
        candidates.push(...buildPortCandidates("close", args[1]));
    } else {
        throw new Error(`ssh-server command '${cmd}' is not supported`);
    }

    return candidates;
}

(async () => {
    const args = alfy.input.split(" ").filter(value => value.length > 0);

    if (args.length >= 1) {
        // since oclif is not initialized here, we need to call the Noop command to get oclif initialized
        Config.configDir = (await ConfigCommand.run(["-q"])).configDir;
        try {
            const candidates = getAlfredCandidates(args);
            candidates.length > 0 && alfy.output(candidates);
        } catch (e) {
            alfy.error(e);
        }
    }
})();

