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

function loadServerConfigFile(file: string): ServerConfig[] {
    if (!fs.existsSync(file)) {
        return [];
    }
    const config = yaml.load(fs.readFileSync(file, {encoding: "utf-8"})) as { servers: ServerConfig[]; };
    return config.servers;
}

export function getServerConfig(configDir: string, server: string): ServerConfig | undefined {
    const configs = loadServerConfigFile(path.join(configDir, "config.yaml"));
    return configs.find(value => value.name === server);
}
