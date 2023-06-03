import '@logseq/libs';
import { Language } from '@libs/lang/language';

const lang = async() => {
    const l: string = (await logseq.App.getUserConfigs()).preferredLanguage;
    return new Language(l);
}

export {
    lang
}