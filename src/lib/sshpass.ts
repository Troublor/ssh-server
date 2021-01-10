import {Command} from "@troubkit/cmd";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import {ContextLogger} from "@troubkit/log";

export function getOrInstallSshpass(): Command {
    const dependencies = path.join(__dirname, "..", "..", "dependencies");
    if (!fs.existsSync(dependencies)) {
        fs.mkdirSync(dependencies);
    }
    const sshpass = path.join(dependencies, "sshpass-1.06", "bin", "sshpass");
    const installSshpass = (dependenciesDir: string) => {
        const logger = new ContextLogger("Install-sshpass");
        if (fs.existsSync(path.join(dependenciesDir, "sshpass-1.06"))) {
            logger.info("Remove previous installation");
            fs.rmdirSync(path.join(dependenciesDir, "sshpass-1.06"), {recursive: true});
        }
        logger.info("Downloading sshpass source code...");
        const downloadCmd = new Command("curl -O -L https://fossies.org/linux/privat/sshpass-1.06.tar.gz");
        let r = child_process.spawnSync(downloadCmd.command, downloadCmd.args, {
            cwd: dependenciesDir,
            stdio: "inherit",
            env: process.env,
        });
        if (r.error) {
            throw r.error;
        }
        if (r.status !== 0) {
            throw new Error("curl exit with code " + r.status);
        }
        logger.info("Downloading sshpass source code...done");
        logger.info("Extracting tarball...");
        const tarCmd = new Command("tar xvzf sshpass-1.06.tar.gz");
        r = child_process.spawnSync(tarCmd.command, tarCmd.args, {
            cwd: dependenciesDir,
            stdio: "inherit",
            env: process.env,
        });
        if (r.error) {
            throw r.error;
        }
        if (r.status !== 0) {
            throw new Error("tar exit with code " + r.status);
        }
        logger.info("Extracting tarball...done");
        // fs.unlinkSync(path.join(dependenciesDir, "sshpass-1.06.tar.gz"));
        logger.info("Installing sshpass...");
        const configCmd = new Command("./configure --prefix=" + path.join(dependenciesDir, "sshpass-1.06"));
        r = child_process.spawnSync(configCmd.command, configCmd.args, {
            cwd: path.join(dependenciesDir, "sshpass-1.06"),
            stdio: "inherit",
            env: process.env,
        });
        if (r.error) {
            throw r.error;
        }
        if (r.status !== 0) {
            throw new Error("./configure exit with code " + r.status);
        }
        const makeCmd = new Command("make install");
        r = child_process.spawnSync(makeCmd.command, makeCmd.args, {
            cwd: path.join(dependenciesDir, "sshpass-1.06"),
            stdio: "inherit",
            env: process.env,
        });
        if (r.error) {
            throw r.error;
        }
        if (r.status !== 0) {
            throw new Error("make exit with code " + r.status);
        }
        logger.info("Installing sshpass...done");
        return new Command(path.join(dependenciesDir, "sshpass-1.06", "bin", "sshpass"));
    };
    if (!fs.existsSync(sshpass)) {
        return installSshpass(dependencies);
    } else {
        return new Command(sshpass);
    }
}
