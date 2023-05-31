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
        key: "openaiUrl",
        type: "string",
        default: "https://api.openai.com",
        title: "OpenAI Url",
        description:
            "You can add the OpenAI proxy address.",
    }
];

export function getSettings(): any {
    const apiKey: string = logseq.settings!["openaiKey"];
    const address: string = logseq.settings!["openaiUrl"];

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