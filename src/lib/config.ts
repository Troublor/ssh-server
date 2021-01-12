import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

export interface ServerConfig {
    name: string,
    host: string,
    username: string,
    password?: string | undefined,
    identityFile?: string | undefined,
    home?: string | undefined,
    port?: number | undefined,
}

export default class Config {
    public static configDir = "";

    static loadServerConfigFile(): ServerConfig[] {
        const file = path.join(Config.configDir, "config.yaml");
        if (!fs.existsSync(file)) {
            return [];
        }
        const config = yaml.load(fs.readFileSync(file, {encoding: "utf-8"})) as { servers: ServerConfig[]; };
        return config.servers;
    }

    static getServerConfig(server: string): ServerConfig | undefined {
        const configs = Config.loadServerConfigFile();
        return configs.find(value => value.name === server);
    }

}
