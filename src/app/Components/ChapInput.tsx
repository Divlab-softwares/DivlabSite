import { useState } from "react";

function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
    const [message, setMessage] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && message.trim() !== "") {
            onSend(message);
            setMessage(""); // vide l'input après envoi
        }
    };

    return (
        <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tape ton message..."
            className="border p-2 w-full"
        />
    );
}