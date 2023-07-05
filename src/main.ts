import '@logseq/libs';
import { settingsSchema } from '@/libs';
import { slash } from './slash';
import { select } from './select/select';

async function main () {
    await logseq.useSettingsSchema(await settingsSchema());
    await slash();
    await select();
}

// bootstrap
logseq.ready(main).catch(console.error);