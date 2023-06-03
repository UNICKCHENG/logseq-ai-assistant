export class OpenAI {
    private apiKey: string;
    private address: string;
    private model: string;

    constructor(apiKey: string, address: string, model: string) {
        this.apiKey = apiKey;
        this.address = address;
        this.model = model;
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
                    "model": this.model,
                    "messages": [{"role": "user", "content": content}],
                    "stream": true,
                })
            });
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
