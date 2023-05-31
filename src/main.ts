import '@logseq/libs';
import { chat } from './lib/openai';
import { settingsSchema } from './lib/settings';

logseq.useSettingsSchema(settingsSchema);

/**
 * Recursively aggregate all content on tree nodes.
 * @param uuid Block ID
 * @param isRecord Whether it is recorded
 */
async function summary(uuid: string, isRecord: boolean): Promise<string> {
    let { content, children }: any = await logseq.Editor.getBlock(uuid);
    if (undefined === children) {
        return content || '';
    }

    content = isRecord ? content : '';
    for (let child of children) {
        content += '\n\n';
        content += await summary(child[1], true);
    }
    return content;
}

/**
 * Use openai chat api to stream content output.
 * @param content prompt 
 * @param rootId block id
 */
async function openai(content: string, rootId: string): Promise<void> {
    try {
        let result: string = "";
        const decoder = new TextDecoder("utf-8");

        const reader = (await chat(content)).body?.getReader();
        let uuid: string|undefined = (await logseq.Editor.insertBlock(rootId, `loading...`))?.uuid;

        while (undefined !== uuid) {
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
            await logseq.Editor.exitEditingMode();
        }    
    } catch (err: any) {
        logseq.UI.showMsg(err.message, 'error');
    }
}

function main () {

    logseq.Editor.registerSlashCommand('gpt-block', 
        async () => {
            let { uuid }: any = await logseq.Editor.getCurrentBlock();
            let content = await summary(uuid, true);
            content += '\nPlease try to summarize the content of the above text, phonetically.'
            await openai(content, uuid);
        }
    )

    logseq.Editor.registerSlashCommand('gpt',
        async() => {
            let { content, uuid }: any = await logseq.Editor.getCurrentBlock();
            await openai(content, uuid);
    });
}

// bootstrap
logseq.ready(main).catch(console.error)