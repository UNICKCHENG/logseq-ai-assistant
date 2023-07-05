interface LanguageMessages {
    [key: string]: {
        [key: string]: string
    };
}

export const messages: LanguageMessages ={
    "en": {
        "openaiKey-description": "Your OpenAI API key. You can get one at https://platform.openai.com/account/api-keys.",
        "openaiAddress-description": "You can add the OpenAI proxy address. The default value is `https://api.openai.com`.",
        "GPTModel-description": "You can choose the ChatGPT model. The default value is `gpt-3.5-turbo`.",
        "apiKey-error": "Please set your OpenAI API Key in the plugin configuration.",
        "address-error": "Please set your OpenAI proxy address in the plugin configuration.",
        "generateAdvancedQuery-description": "The prompt for generating advanced query code in Logseq, which can be customized.",
        "isTextQuery-description": "Whether to enable word selection query. When enabled, it will query other related blocks. Note that this may affect your usage experience.",
        "isStreamingOutput-description": "Is stream output enabled for GPT? If enabled, there is a possibility of output failure."
    },
    "zh-CN": {
        "openaiKey-description": "您的 OpenAI key. 您可从网站获取 https://platform.openai.com/account/api-keys.",
        "openaiAddress-description": "您可以自定义代理地址. 默认使用 OpenAI 的官方地址 `https://api.openai.com`.",
        "GPTModel-description": "您可以选择 GPT 模型. 默认使用 `gpt-3.5-turbo`.",
        "apiKey-error": "请在插件配置中先设置您的 OpenAI Key",
        "address-error": "请在插件配置中先设置您的 OpenAI 代理地址",
        "generateAdvancedQuery-description": "生成 logseq 高级查询代码的提示词，可自行定义.",
        "isTextQuery-description": "是否开启划词查询，当开启后，将会查询其他关联的块。注意可能会影响使用体验。",
        "isStreamingOutput-description": "是否为 gpt 开启流式输出，如果开启，可能会出现输出失败的情况。"
    },
}