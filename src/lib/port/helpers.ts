import Config, {ServerConfig} from "../config";
import * as path from "path";
import * as fs from "fs";

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

export function genForwardSocket(fw: ForwardPattern): string {
    return path.join("socket", `${fw.localAddress}-${fw.localPort}-${fw.remoteAddress}-${fw.remotePort}`);
}

export function getCurrentlyOpeningForwards(): ForwardPattern[] {
    const socket = path.join(Config.configDir, "socket");
    const patterns: ForwardPattern[] = [];
    if (fs.existsSync(socket) && fs.statSync(socket).isDirectory()) {
        for (const s of fs.readdirSync(socket)) {
            const secs = s.split("-");
            if (secs.length === 4) {
                patterns.push({
                    localAddress: secs[0],
                    localPort: parseInt(secs[1]),
                    localStr: "localhost:" + parseInt(secs[1]),
                    remoteAddress: secs[2],
                    remotePort: parseInt(secs[3]),
                    remoteStr: `${secs[2]}:${parseInt(secs[3])}`,
                });
            }
        }
    }
    return patterns;
}
