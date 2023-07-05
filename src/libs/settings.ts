import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";
import { lang } from './language';
import prompts from '@/prompt/query.toml?raw';
import toml from 'toml';

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
            enumChoices: ["gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-4", "gpt-4-32k", "gpt-3.5-turbo-0613", "gpt-4-0613"],
            description: (await lang()).message('GPTModel-description'),
        },
        {
            type: "heading",
            title: "Beta Features",
        },
        {
            key: "isStreamingOutput",
            type: "boolean",
            default: true,
            title: "Streaming Output",
            description: (await lang()).message('isStreamingOutput-description'),
        },
        {
            key: "isTextQuery",
            type: "boolean",
            default: false,
            title: "Text Query",
            description: (await lang()).message('isTextQuery-description'),
        }
        // {
        //     key: "generateAdvancedQuery",
        //     type: "string",
        //     default: '',
        //     title: "Generate Advanced Query Prompt",
        //     inputAs: "textarea",
        //     description: (await lang()).message('generateAdvancedQuery-description'),
        // },
    ] as SettingSchemaDesc[];
}

export const getSettings = async() => {
    const pormpt: any = toml.parse(prompts);
    const openaiKey: string = logseq.settings!["openaiKey"];
    const openaiAddress: string = logseq.settings!["openaiAddress"];
    const gptModel: string = logseq.settings!["GPTModel"];
    let promptAdvancedQuery: string = logseq.settings!["generateAdvancedQuery"];
    const isTextQuery: boolean = logseq.settings!["isTextQuery"];

    if(undefined === openaiKey || '' === openaiKey) {
        throw new Error((await lang()).message('apiKey-error'));
    }
    if(undefined === openaiAddress || '' === openaiAddress) {
        throw new Error((await lang()).message('address-error'));
    }
    if( undefined === promptAdvancedQuery || '' === promptAdvancedQuery.replaceAll(' ', '')) {
        promptAdvancedQuery = pormpt['advanced-query'].prompt;
    }

    return {
        openaiKey,
        openaiAddress,
        gptModel,
        promptAdvancedQuery,
        isTextQuery,
        isStreamingOutput: logseq.settings!["isStreamingOutput"] as boolean
    };
}