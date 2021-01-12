import {Command, flags} from "@oclif/command";
import {getServerConfig, ServerConfig} from "./config";
import {OutputFlags, ParserInput} from "@oclif/parser/lib/parse";
import * as path from "path";

export default abstract class SshBase extends Command {
    static flags = {
        help: flags.help({char: "h"}),
        host: flags.string({char: "H", description: "host of the server"}),
        home: flags.string({description: "home path on the server"}),
        username: flags.string({char: "u", description: "username used to logon server"}),
        password: flags.string({char: "p", description: "password to logon server"}),
        identityFile: flags.string({char: "i", description: "path to ssh identity file to logon server"}),
        port: flags.string({char: "P", description: "port of the ssh server"}),
    };

    protected parseServerConfig<F extends ParserInput["flags"]>(server: string | undefined, flags: OutputFlags<F>): ServerConfig {
        let config: ServerConfig | undefined = undefined;
        if (server) {
            config = getServerConfig(this.config.configDir, server);
        }
        if (!config) {
            // the server is not defined in config file
            if (!flags.host || !flags.username) {
                throw new Error("server name not provide or not registered, please specify --host, --username, --password/--keyFile or add configuration in " + path.join(this.config.configDir, "config.yaml"));
            }
            config = {
                name: flags.host,
                host: flags.host,
                username: flags.username,
                home: flags.home ?? `/home/${flags.username}`,
                password: flags.password,
                identityFile: flags.identityFile,
                port: flags.port ?? 22,
            };
        } else {
            // override
            if (flags.host) {
                config.host = flags.host;
            }
            if (flags.home) {
                config.home = flags.home;
            }
            if (flags.username) {
                config.username = flags.username;
            }
            if (flags.password) {
                config.password = flags.password;
            }
            if (flags.identityFile) {
                config.identityFile = flags.identityFile;
            }
            if (flags.port) {
                config.port = flags.port;
            }
        }
        return config;
    }
}
