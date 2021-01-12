import {ServerConfig} from "../config";
import * as path from "path";

export interface ForwardPattern {
    localAddress: string,
    localPort: number,
    localStr: string,
    remoteAddress: string,
    remotePort: number,
    remoteStr: string,
}

export function parseForwardPattern(config: ServerConfig, payload: string): ForwardPattern {
    const secs = payload.split(":");
    const r = {
        localAddress: "localhost",
        localPort: parseInt(secs[0]),
        localStr: "localhost:" + parseInt(secs[0]),
        remoteAddress: config.host,
        remotePort: parseInt(secs[1]),
        remoteStr: `${config.host}:${parseInt(secs[1])}`,
    };
    if (isNaN(r.localPort) || isNaN(r.remotePort)) {
        throw new Error(`failed to parse forward pattern '${payload}'`);
    }
    return r;
}

export function genForwardSocket(configDir: string, fw: ForwardPattern): string {
    return path.join("socket", `${fw.localAddress}-${fw.localPort}-${fw.remoteAddress}-${fw.remotePort}`);
}
