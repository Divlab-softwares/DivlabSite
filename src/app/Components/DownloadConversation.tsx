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


export function downloadConversation(messages: Message[], filename = "conversation.txt") {
    const content = formatConversation(messages);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
console.log("Downloading conversation:", content);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
