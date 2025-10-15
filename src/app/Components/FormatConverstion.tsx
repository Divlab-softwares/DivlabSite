
type Message = {
    id: number;
    user: string;
    message: string;
    answer?: string;
    files: File[];
    score: number;
    ts?: number;
};

export function formatConversation(messages: Message[]): string {
    // On met un format simple : [User/Bot]: message
    return messages
        .map((msg) => {
            return `[Vous] : ${msg.message} 
[DivlabAi] : ${msg.answer} 
`;
        })
        .join("\n");
}
