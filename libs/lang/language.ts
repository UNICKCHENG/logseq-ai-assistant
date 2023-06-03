import { messages } from './message';

export class Language {
    private lang: string;

    constructor(lang?: string) {
        this.lang = 'zh-CN' === lang ? lang : 'en';
    }

    public message = (key: string) => {
        return messages[this.lang][key] || '';
    }
}
