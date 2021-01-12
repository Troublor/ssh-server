import {Hook} from "@oclif/config";
import * as fs from "fs";
import * as path from "path";
import Config from "../lib/config";

export const hook: Hook<"init"> = async function (options) {
    Config.configDir = options.config.configDir;

    if (!fs.existsSync(options.config.configDir)) {
        fs.mkdirSync(options.config.configDir, {recursive: true});
    }
    if (!fs.existsSync(path.join(options.config.configDir, "socket"))) {
        fs.mkdirSync(path.join(options.config.configDir, "socket"));
    }
};
