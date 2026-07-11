// ChatConversation.tsx (extrait)
import React, { useEffect, useRef, useState, useCallback } from 'react';
import TextType from './TextType';
import PageLoader from './pageLoader';
import { motion } from 'motion/react';

// interface Message {
//     id?: string; // idéalement présent
//     text: string;
//     ts?: number;
//     sender?: 'me' | 'bot';
// }

type ChatRequest = {
    id: number;
    user: string;
    message: string;
    answer?: string;
    files: File[];
    score: number;
    ts?: string;
};

interface ChatConversationProps {
    bottomRef: React.RefObject<HTMLDivElement | null>;
    requ: ChatRequest[];
    conversationId: string;
    // fetchMessages: (conversationId: string) => Promise<Request[]>;
    renderImages: (files: File[]) => React.ReactNode; // fonction pour rendre les images
    setThinking: React.Dispatch<React.SetStateAction<boolean>>;
    thinking: boolean;
    onThinkingChange?: (v: boolean) => void;
    onBotFinished?: (messageId?: number) => void;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ conversationId, requ, renderImages, bottomRef, setThinking, thinking, onThinkingChange, onBotFinished }) => {
    const animatedByConvRef = useRef<Record<string, Set<string>>>({});

    // ensure set exists
    const ensureSet = (convId: string) => {
        if (!animatedByConvRef.current[convId]) animatedByConvRef.current[convId] = new Set();
        return animatedByConvRef.current[convId];
    };

    const getMessageKey = (m: ChatRequest) => {
        if (m.id !== undefined) return String(m.id);
        return `${String(conversationId)}-${m.ts ?? 'noTs'}-${(m.message ?? '').slice(0, 50)}`;
    };

    const handleOnAnimated = useCallback((messageKey: string) => {
        const set = ensureSet(String(conversationId));
        if (!set.has(messageKey)) {
            set.add(messageKey); // mutation MAIS hors du render (dans callback)
        }
        // pas besoin de forcer rerender sauf si tu veux refléter un UI change immédiat
    }, [conversationId]);

    return (
        <div className=" pt-22 bg-zinc-900 rounded-md ">

            {requ.map((req, index) => {
                const messageKey = getMessageKey(req);
                // lecture seule pour décider d'animer ou non
                const alreadyAnimated = !!animatedByConvRef.current[String(conversationId)]?.has(messageKey);

                return (

                    <motion.div
                        key={req.id}
                        initial={{ height: "0%", opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full flex flex-col  ">
                        {req.message != "null" && (
                        <motion.div
                            initial={{ x: "2%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="p-2 px-5 w-full h-fit items-center justify-end flex flex-row">
                            <div className={`flex flex-col gap-1 max-w-1/2 w-fit rounded-2xl  p-2 ${req.user === "user"
                                ? "bg-blue-500 text-white self-end ml-auto"
                                : "bg-gray-200 text-black self-start"
                                } `}>
                                {req.files.length !== 0 && <div className="">
                                    {req.files && renderImages(req.files)}
                                </div>}
                                <p className="text-center">{req.message}</p>

                            </div>
                        </motion.div>
                        )}
                        {/* Marqueur de fin */}
                        {req.answer != "null" && (
                            <motion.div
                                initial={{ x: "-2%", opacity: 0 }}
                                animate={{ x: "0%", opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="p-2 px-5 w-full h-fit  items-center justify-start flex flex-row">
                                <div className=" w-fit rounded-2xl bg-zinc-600/40 p-2  ">
                                    {/* {alreadyAnimated.map((id: any) => id).includes(req.id.toString()) ? null : alreadyAnimated.add(req.id.toString())} */}
                                    <div>
                                        {/* {req.id} + {req.id.toString()} */}

                                        <TextType
                                            text={req.answer ? req.answer : "Erreur de chargement de la reponse"}
                                            typingSpeed={10}
                                            pauseDuration={1500}
                                            showCursor={false}
                                            cursorCharacter="|"
                                            skipAnimation={alreadyAnimated}
                                            messageId={messageKey}
                                            onAnimated={() => handleOnAnimated(messageKey)} // 👈 évite de retaper
                                            loop={false}
                                            onSentenceComplete={(id) => onBotFinished?.(req.id)}
                                        />

                                    </div>


                                </div>

                            </motion.div>
                        )}
                        
                    </motion.div>


                );
            })}
            {/* Marqueur de fin */}
            {thinking && (
                <div className="italic text-gray-500 text-sm">Le bot est en train d’écrire...</div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}

export default ChatConversation