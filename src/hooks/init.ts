import {Hook} from "@oclif/config";
import * as fs from "fs";
import * as path from "path";

export const hook: Hook<"init"> = async function (options) {
    if (!fs.existsSync(options.config.configDir)) {
        fs.mkdirSync(options.config.configDir, {recursive: true});
    }
    if (!fs.existsSync(path.join(options.config.configDir, "socket"))) {
        fs.mkdirSync(path.join(options.config.configDir, "socket"));
    }
};
