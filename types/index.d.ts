declare module "alfy" {
    interface ScriptFilterJsonFormat {
        uid?: string,
        type?: "default" | "file" | "file:skipcheck",
        title: string,
        subtitle?: string,
        arg?: string,
        autocomplete?: string,
        icon?: {
            type?: "fileicon" | "filetype",
            path: string
        },
        valid?: boolean
        // eslint-disable-next-line @typescript-eslint/ban-types
        mods?: object
        // eslint-disable-next-line @typescript-eslint/ban-types
        text?: object
        quicklookurl?: string
    }

    const input: string;

    function output(list: ScriptFilterJsonFormat[]): void;

    function error(err: Error | string): void;
}
