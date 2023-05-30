import '@logseq/libs';
import { chat } from './lib/openai';
import { settingsSchema } from './lib/settings';

logseq.useSettingsSchema(settingsSchema);

function main () {
    logseq.Editor.registerSlashCommand('gpt',
        async() => {
            let { content, uuid }: any = await logseq.Editor.getCurrentBlock();
            uuid = (await logseq.Editor.insertBlock(uuid, `loading...`))?.uuid;

            let result: string = "";
            const decoder = new TextDecoder("utf-8");
            const reader = (await chat(content)).body?.getReader();
            while (true) {
                const { done, value }: any = await reader?.read();
                if (done) {
                    break;
                }
                // Massage and parse the chunk of data
                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");
                const parsedLines = lines
                    .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
                    .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
                    .map((line) => JSON.parse(line)); // Parse the JSON string

                for (const parsedLine of parsedLines) {
                    const { choices } = parsedLine;
                    const { delta } = choices[0];
                    const { content } = delta;
                    if (content) {
                        result += content;
                    }
                }
                await logseq.Editor.updateBlock(uuid, result);
            }
    });
}

// bootstrap
logseq.ready(main).catch(console.error)