import '@logseq/libs';
import { OpenAI, toMessages } from '@libs/openai';
import { settingsSchema, getSettings } from './settings';

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
 * @param block_id block ID
 * @param user_content content
 * @param opts gpt prompt
 */
async function openaiStream(
    block_id: string,
    user_content: string,
    opts?: {
        system_content?: string,
        assistant_content?: string
    }
): Promise<void> {
    try {
        const { openaiKey, openaiAddress, gptModel } = await getSettings();
        const openai: OpenAI = new OpenAI(openaiKey, openaiAddress, gptModel);
        const uuid: string|undefined = (await logseq.Editor.insertBlock(block_id, `loading...`))?.uuid;

        let result: string = "";
        const decoder = new TextDecoder("utf-8");
        const reader = (await openai.chat(toMessages(
            user_content, {
            system: opts?.system_content,
            assistant: opts?.assistant_content
        }))).body?.getReader();

        while (undefined !== uuid) {
            const { done, value }: any = await reader?.read();
            if (done) {
                break;
            }
            
            const lines = decoder.decode(value).split("\n");
            const parsedLines = lines
                .map((line) => line.replace(/^data: /, "").trim())  // Remove the "data: " prefix
                .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
                .map((line) => JSON.parse(line));                   // Parse the JSON string

            for (const line of parsedLines) {
                const { content } = line.choices[0].delta;
                if (content) {
                    result += content;
                }
            }
            await logseq.Editor.updateBlock(uuid, result);
        }
        await logseq.Editor.editBlock(block_id);
    } catch (err: any) {
        logseq.UI.showMsg(err.message, 'error');
    }
}

async function generateAdvancedQuery(content: string, block_id: string) {
    try {
        const { openaiKey, openaiAddress, gptModel, promptAdvancedQuery } = await getSettings();
        const openai: OpenAI = new OpenAI(openaiKey, openaiAddress, gptModel);
        const uuid: string|undefined = (await logseq.Editor.insertBlock(block_id, `loading...`))?.uuid;

        if (undefined != uuid) {
            const result: string = (await openai.chat(toMessages(
                content + '(output the code text only without additional explanations.)', {
                system: promptAdvancedQuery
            }), false));

            await logseq.Editor.updateBlock(uuid, result.replace(/^```+|```+$/g, ''));
            await logseq.Editor.editBlock(block_id);
        }
    } catch (err: any) {
        logseq.UI.showMsg(err.message, 'error');
    }
}

export {
    settingsSchema,
    summary,
    openaiStream,
    generateAdvancedQuery
}