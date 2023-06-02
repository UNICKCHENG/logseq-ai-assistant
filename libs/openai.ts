export class OpenAI {
    private apiKey: string;
    private address: string;

    constructor(apiKey: string, address: string) {
        this.apiKey = apiKey;
        this.address = address;
    }

    public chat = async(content: string) => {
        try {
            const url: string = `${this.address}/v1/chat/completions`;
            return await fetch(`${url}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
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
}
