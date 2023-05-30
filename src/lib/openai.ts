import { getSettings } from './settings';

export const chat = async(content: string) => {
    const baseUrl: string = `${(await getSettings()).baseUrl}/v1/chat/completions`;
    try {
        return await fetch(`${baseUrl}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await getSettings()).apiKeys}`
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