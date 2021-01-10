import {Command, flags} from "@oclif/command";
import {configFile, getServerConfig, ServerConfig} from "./config";
import {OutputArgs, OutputFlags, ParserInput} from "@oclif/parser/lib/parse";

export default abstract class SshBase extends Command {
    static flags = {
        help: flags.help({char: "h"}),
        host: flags.string({char: "H", description: "host of the server"}),
        home: flags.string({description: "home path on the server"}),
        username: flags.string({char: "u", description: "username used to logon server"}),
        password: flags.string({char: "p", description: "password to logon server"}),
        keyFile: flags.string({char: "k", description: "path to ssh key file to logon server"}),
    };

    static args = [{name: "server", description: "name of server predefined in config file"}];

    protected parseServerConfig<A extends ParserInput["args"], F extends ParserInput["flags"]>(args: OutputArgs<A>, flags: OutputFlags<F>): ServerConfig {
        let config: ServerConfig | undefined = undefined;
        if ((args as { server: string }).server) {
            config = getServerConfig((args as { server: string }).server);
        }
        if (!config) {
            // the server is not defined in config file
            if (!flags.host || !flags.username) {
                throw new Error("server name not provide or not registered, please specify --host, --username, --password/--keyFile or add configuration in " + configFile);
            }
            config = {
                name: flags.host,
                host: flags.host,
                username: flags.username,
                home: flags.home ?? `/home/${flags.username}`,
                password: flags.password,
                keyFile: flags.keyFile,
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
            if (flags.keyFile) {
                config.keyFile = flags.keyFile;
            }
        }
        return config;
    }
}
