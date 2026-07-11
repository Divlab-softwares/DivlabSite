import { formatConversation } from "./FormatConverstion";

type Message = {
    id: number;
    user: string;
    message: string;
    answer?: string;
    files: File[];
    score: number;
    ts?: number;
};

export function copyConversation(messages: Message[]) {
    const content = formatConversation(messages);
    navigator.clipboard.writeText(content)
        .then(() => alert("Conversation copiée !"))
        .catch((err) => console.error("Impossible de copier : ", err));
}
