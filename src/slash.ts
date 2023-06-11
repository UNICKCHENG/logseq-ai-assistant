import * as api from '@/libs/api';
import '@logseq/libs';

export async function slash () {
    await logseq.Editor.registerSlashCommand('gpt-block', 
        async () => {
            let { uuid }: any = await logseq.Editor.getCurrentBlock();
            let content = await api.summary(uuid, true);
            content += '\nPlease try to summarize the content of the above text.'
            await api.openaiStream(content, uuid);
    });

    await logseq.Editor.registerSlashCommand('gpt',
        async() => {
            let { content, uuid }: any = await logseq.Editor.getCurrentBlock();
            await api.openaiStream(uuid, content);
    });

    await logseq.Editor.registerSlashCommand('aihey', 
        async () => {
            let { uuid, content, parent }: any = await logseq.Editor.getCurrentBlock();
            const system_content: string|undefined = (await logseq.Editor.getBlock(parent.id))?.content || undefined;
            await api.openaiStream(uuid, content, {system_content});
    });
}