import { getSettings } from './settings';

export const chat = async(content: string) => {
    try {
        const { apiKey, address }: any = getSettings();
        const url: string = `${address}/v1/chat/completions`;
        return await fetch(`${url}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": content}],
                "stream": true,
            })
        });
    } catch (err: any) {
        throw new Error(err.message);
    }
}