import '@logseq/libs';
import { chat } from './lib/openai';
import { settingsSchema } from './lib/settings';

logseq.useSettingsSchema(settingsSchema);

function main () {
    logseq.Editor.registerSlashCommand('gpt',
    async() => {
        const { content, uuid }: any = await logseq.Editor.getCurrentBlock();
        logseq.Editor.insertBlock(uuid, await chat(content));
    });
}

// bootstrap
logseq.ready(main).catch(console.error)