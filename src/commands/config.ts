import {flags} from "@oclif/command";
import {Command} from "@oclif/command";
import {IConfig} from "@oclif/config";

export default class Config extends Command {
    static hidden = true;

    static flags = {
        quiet: flags.boolean({char: "q", default: false}),
    };

    async run(): Promise<IConfig> {
        // an empty used to initialize oclif
        const {flags} = this.parse(Config);
        if (!flags.quiet) {
            this.log(JSON.stringify(this.config, null, 2));
        }

        return this.config;
    }
}
