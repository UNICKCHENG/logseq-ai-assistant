import { summary, openai, settingsSchema } from '@/libs/api';
import '@logseq/libs';

async function main () {
    logseq.useSettingsSchema(await settingsSchema());

    logseq.Editor.registerSlashCommand('gpt-block', 
        async () => {
            let { uuid }: any = await logseq.Editor.getCurrentBlock();
            let content = await summary(uuid, true);
            content += '\nPlease try to summarize the content of the above text.'
            await openai(content, uuid);
    });

    logseq.Editor.registerSlashCommand('gpt',
        async() => {
            let { content, uuid }: any = await logseq.Editor.getCurrentBlock();
            await openai(content, uuid);
    });
}

// bootstrap
logseq.ready(main).catch(console.error);