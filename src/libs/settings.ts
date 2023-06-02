import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const settingsSchema: SettingSchemaDesc[] = [
    {
        key: "openaiKey",
        type: "string",
        default: "",
        title: "OpenAI API Key",
        description:
          "Your OpenAI API key. You can get one at https://platform.openai.com/account/api-keys",
    },
    {
        key: "openaiAddress",
        type: "string",
        default: "https://api.openai.com",
        title: "OpenAI Address",
        description:
            "You can add the OpenAI proxy address. The default value is `https://api.openai.com`",
    },
    {
        key: "language",
        type: "string",
        default: "",
        title: "AI Language",
        description:
            "You can set the language for reply, such as `中文` `English` `Deutsch` `한국어` and so on.",
    },
];

export function getSettings(): any {
    const apiKey: string = logseq.settings!["openaiKey"];
    const address: string = logseq.settings!["openaiAddress"];

    if(undefined === apiKey || '' === apiKey) {
        throw new Error('Please set your OpenAI API Key in the plugin configuration.');
    }
    if(undefined === address || '' === address) {
        throw new Error('Please set your OpenAI proxy address in the plugin configuration.');
    }

    return {
        apiKey,
        address,
    };
}