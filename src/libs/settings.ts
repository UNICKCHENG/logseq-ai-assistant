import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";
import { lang } from './language';

export const settingsSchema = async() => {
    return [
        {
            key: "openaiKey",
            type: "string",
            default: "",
            title: "OpenAI API Key",
            description: (await lang()).message("openaiKey-description"),
        },
        {
            key: "openaiAddress",
            type: "string",
            default: "https://api.openai.com",
            title: "OpenAI Address",
            description: (await lang()).message('openaiAddress-description'),
        },
        {
            key: "GPTModel",
            type: "enum",
            default: "gpt-3.5-turbo",
            title: "ChatGPT Models",
            enumChoices: ["gpt-3.5-turbo", "gpt-4", "gpt-4-32k"],
            description: (await lang()).message('GPTModel-description'),
        },
    ] as SettingSchemaDesc[];
}

export const getSettings = async() => {
    const openaiKey: string = logseq.settings!["openaiKey"];
    const openaiAddress: string = logseq.settings!["openaiAddress"];
    const gptModel: string = logseq.settings!["GPTModel"];

    if(undefined === openaiKey || '' === openaiKey) {
        throw new Error((await lang()).message('apiKey-error'));
    }
    if(undefined === openaiAddress || '' === openaiAddress) {
        throw new Error((await lang()).message('address-error'));
    }

    return {
        openaiKey,
        openaiAddress,
        gptModel
    };
}