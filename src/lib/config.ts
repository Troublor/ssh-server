import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

export interface ServerConfig {
    name: string,
    host: string,
    username: string,
    password?: string | undefined,
    keyFile?: string | undefined,
    home?: string | undefined,
}

function loadServerConfigFile(file: string): ServerConfig[] {
    if (!fs.existsSync(configFile)) {
        return [];
    }
    const config = yaml.load(fs.readFileSync(file, {encoding: "utf-8"})) as { servers: ServerConfig[]; };
    return config.servers;
}

export let configFile = path.join(process.env.HOME as string, "ssh-server.config.yaml");

export function getServerConfig(server: string): ServerConfig | undefined {
    const configs = loadServerConfigFile(configFile);
    return configs.find(value => value.name === server);
}

export function setConfigFilePath(file: string): void {
    configFile = file;
}
