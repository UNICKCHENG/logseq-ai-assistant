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
    const apiKeys: string = logseq.settings!["openaiKey"];
    const baseUrl: string = logseq.settings!["openaiUrl"];

    return {
        apiKeys,
        baseUrl,
    };
}