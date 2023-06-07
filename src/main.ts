import * as api from '@/libs/api';
import '@logseq/libs';

async function main () {
    await logseq.useSettingsSchema(await api.settingsSchema());

    logseq.Editor.registerSlashCommand('gpt-block', 
        async () => {
            let { uuid }: any = await logseq.Editor.getCurrentBlock();
            let content = await api.summary(uuid, true);
            content += '\nPlease try to summarize the content of the above text.'
            await api.openaiStream(content, uuid);
    });

    logseq.Editor.registerSlashCommand('gpt',
        async() => {
            let { content, uuid }: any = await logseq.Editor.getCurrentBlock();
            await api.openaiStream(uuid, content);
    });

    logseq.Editor.registerSlashCommand('aihey', 
        async () => {
            let { uuid, content, parent }: any = await logseq.Editor.getCurrentBlock();
            const system_content: string|undefined = (await logseq.Editor.getBlock(parent.id))?.content || undefined;
            await api.openaiStream(uuid, content, {system_content});
    });
}

// bootstrap
logseq.ready(main).catch(console.error);