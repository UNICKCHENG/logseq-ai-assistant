export enum OpenAIMessagesRole {
    system = "system",
    assistant = "assistant",
    user ="user",
}

export interface OpenAIMessage {
    role: OpenAIMessagesRole;
    content: string;
}

export const toMessages = (user: string, opts?: {
    assistant?: string, 
    system?: string
}) => {
    const messages: OpenAIMessage[] = [];
    const { assistant, system } = opts || {};
    if (system) {
        messages.push({role: OpenAIMessagesRole.system, content: system})
    }
    if (assistant) {
        messages.push({role: OpenAIMessagesRole.assistant, content: assistant})
    }
    messages.push({role: OpenAIMessagesRole.user, content: user})
    return messages;
}

export class OpenAI {
    private apiKey: string;
    private address: string;
    private model: string;

    constructor(apiKey: string, address: string, model: string) {
        this.apiKey = apiKey;
        this.address = address;
        this.model = model;
    }

    public chat = async(
        messages: OpenAIMessage[],
        is_stream: boolean = true
    ) => {
        try {
            const url: string = `${this.address}/v1/chat/completions`;
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    "model": this.model,
                    "messages": messages,
                    "stream": is_stream,
                })
            });

            if (is_stream) {
                return response;
            }

            const data = await response.json();
            if (response.ok) {
                return data.choices[0].message.content;
            } else {
                throw new Error(data.message);
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
