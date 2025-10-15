// data/rules.ts

export interface Rule {
    id: string;
    priority: number;
    match: { type: "regex" | "contains"; pattern: string };
    action: { type: "reply"; text: string };
}

export const rules: Rule[] = [
    {
        id: "greeting",
        priority: 100,
        match: { type: "regex", pattern: "^(salut|bonjour|hello|hey)" },
        action: { type: "reply", text: "Salut 👋 ! Comment puis-je t’aider ?" },
    },
     {
        id: "lorem",
        priority: 90,
        match: { type: "contains", pattern: "lorem" },
        action: { type: "reply", text: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolorum soluta, molestiae id eaque nemo ullam laborum quasi, dolores illo aliquid autem repellat odit recusandae in pariatur voluptas possimus odio!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolorum soluta, molestiae id eaque nemo ullam laborum quasi, dolores illo aliquid autem repellat odit recusandae in pariatur voluptas possimus odio!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolorum soluta, molestiae id eaque nemo ullam laborum quasi, dolores illo aliquid autem repellat odit recusandae in pariatur voluptas possimus odio!" },
    }, 
    {
        id: "bye",
        priority: 90,
        match: { type: "contains", pattern: "au revoir" },
        action: { type: "reply", text: "À bientôt 👋" },
    },
    {
        id: "fallback",
        priority: 1,
        match: { type: "regex", pattern: ".*" },
        action: { type: "reply", text: "Désolé, je n’ai pas compris 🤔." },
    },
];
