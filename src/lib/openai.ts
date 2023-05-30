import { getSettings } from './settings';

export const chat = async(content: string) => {
    const baseUrl: string = `${(await getSettings()).baseUrl}/v1/chat/completions`;
    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await getSettings()).apiKeys}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}]
        })
    });

    const data = await response.json();
    if (response.ok) {
        return data.choices[0].message.content;
    } else {
        throw new Error(data.message);
    }
}