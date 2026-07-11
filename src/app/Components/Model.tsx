"use client";
import { useState } from "react";
import { rules, Rule } from "../rules";

interface Context {
    lastRule?: string;
    [key: string]: any;
}

export default function Model() {
    const [context, setContext] = useState<Context>({});
    const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
    const [input, setInput] = useState("");

    const normalize = (txt: string) => txt.trim().toLowerCase();

    const matchRule = (rule: Rule, input: string): boolean => {
        const txt = normalize(input);
        if (rule.match.type === "regex") {
            return new RegExp(rule.match.pattern, "i").test(txt);
        }
        if (rule.match.type === "contains") {
            return txt.includes(rule.match.pattern.toLowerCase());
        }
        return false;
    };

    const chooseRule = (input: string, ctx: Context): Rule | null => {
        const sorted = [...rules].sort((a, b) => b.priority - a.priority);
        for (const r of sorted) {
            if (matchRule(r, input)) return r;
        }
        return null;
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // ajouter message user
        setMessages((prev) => [...prev, { from: "user", text: input }]);

        // chercher règle
        const rule = chooseRule(input, context);
        if (rule) {
            setMessages((prev) => [...prev, { from: "bot", text: rule.action.text }]);
            setContext((prev) => ({ ...prev, lastRule: rule.id }));
        }

        setInput("");
    };

    return (
        <div className="flex flex-col w-full max-w-md mx-auto p-4 border rounded-2xl shadow-md">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg max-w-[80%] ${msg.from === "user"
                                ? "bg-blue-500 text-white self-end ml-auto"
                                : "bg-gray-200 text-black self-start"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écris un message..."
                    className="flex-1 border p-2 rounded-lg"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 rounded-lg"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}
