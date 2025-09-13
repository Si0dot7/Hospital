"use client"
import React, { useState, useRef, useEffect } from 'react';
import rules from './llm_rules.json';

interface Message {
    id: number;
    sender: 'user' | 'llm';
    text: string;
    file?: { name: string; url: string };
    loading?: boolean;
    link?: { label: string; url: string };
}

const initialMessages: Message[] = [
    { id: 1, sender: 'llm', text: 'สวัสดีค่ะ มีอะไรให้จุ๋มช่วยคะวันนี้' },
];

function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const recommendedMessages = [
        "ฉันเหลือวันลาเท่าไหร่",
        "ขอเอกสารใบลาหน่อย",
        "ขอลิงก์ยื่นเอกสาร"
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendUserMessage(input);
        setInput('');
    };

    // Helper to get next unique id
    const getNextId = (msgs: Message[]) =>
        msgs.length > 0 ? Math.max(...msgs.map(m => m.id)) + 1 : 1;

    const sendUserMessage = (text: string) => {
        setMessages((msgs) => {
            const userMsg: Message = {
                id: getNextId(msgs),
                sender: 'user',
                text,
            };
            return [...msgs, userMsg];
        });
        // LLM response rules from JSON
        let llmResponse = '';
        let file: { name: string; url: string } | undefined = undefined;
        let type: string | undefined = undefined;
        let link: { label: string; url: string } | undefined = undefined;
        const foundRule = (rules as Array<{ question: string; answer: string; file?: { name: string; url: string }; type?: string; link?: { label: string; url: string } }>).find(r => r.question === text);
        if (foundRule) {
            llmResponse = foundRule.answer;
            file = foundRule.file;
            type = foundRule.type;
            link = foundRule.link;
        } else {
            llmResponse = `ขออภัย จุ๋มยังไม่เข้าใจคำถามนี้ค่ะ`;
        }
        if (type === 'mcp') {
            // Show loading message first
            setTimeout(() => {
                setMessages((msgs) => {
                    const loadingMsg: Message = {
                        id: getNextId(msgs),
                        sender: 'llm',
                        text: 'กำลังหาข้อมูลที่เกี่ยวข้อง',
                        loading: true,
                    };
                    return [...msgs, loadingMsg];
                });
                // Remove loading and show answer after delay
                setTimeout(() => {
                    setMessages((msgs) => {
                        const filtered = msgs.filter(m => !m.loading);
                        const answerMsg: Message = {
                            id: getNextId(filtered),
                            sender: 'llm',
                            text: llmResponse,
                        };
                        return [...filtered, answerMsg];
                    });
                }, 1200);
            }, 800);
        } else if (type === 'link' && link) {
            setTimeout(() => {
                setMessages((msgs) => {
                    // Add the normal answer bubble
                    const answerMsg: Message = {
                        id: getNextId(msgs),
                        sender: 'llm',
                        text: llmResponse,
                    };
                    let newMsgs = [...msgs, answerMsg];
                    // Add the link bubble with the page title as clickable text
                    const linkMsg: Message = {
                        id: getNextId(newMsgs),
                        sender: 'llm',
                        text: '',
                        link,
                    };
                    return [...newMsgs, linkMsg];
                });
            }, 800);
        } else if (type === 'sos') {
            setTimeout(() => {
                setMessages((msgs) => {
                    // Add the normal answer bubble
                    const answerMsg: Message = {
                        id: getNextId(msgs),
                        sender: 'llm',
                        text: llmResponse,
                    };
                    let newMsgs = [...msgs, answerMsg];
                    // Add the SOS link bubble
                    const linkMsg: Message = {
                        id: getNextId(newMsgs),
                        sender: 'llm',
                        text: '',
                        link: { label: 'จองเวลาติดต่อเจ้าหน้าที่', url: '/hr' },
                    };
                    return [...newMsgs, linkMsg];
                });
            }, 800);
        } else {
            setTimeout(() => {
                // Always reply with normal bubble first
                setMessages((msgs) => {
                    const answerMsg: Message = {
                        id: getNextId(msgs),
                        sender: 'llm',
                        text: llmResponse,
                    };
                    let newMsgs = [...msgs, answerMsg];
                    // If file exists, reply with file bubble after a short delay
                    if (file) {
                        // Prevent multiple file bubbles for the same answer
                        setTimeout(() => {
                            setMessages((msgs2) => {
                                // Only add file bubble if not already present for this file and after this answer
                                const lastMsg = msgs2[msgs2.length - 1];
                                if (!lastMsg || !lastMsg.file || lastMsg.file.url !== file.url) {
                                    const fileMsg: Message = {
                                        id: getNextId(msgs2),
                                        sender: 'llm',
                                        text: '',
                                        file,
                                    };
                                    return [...msgs2, fileMsg];
                                }
                                return msgs2;
                            });
                        }, 400);
                    }
                    return newMsgs;
                });
            }, 800);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex flex-col gap-1 items-${msg.sender === 'user' ? 'end' : 'start'}`}>
                            {/* Normal message bubble */}
                            {msg.text && (!msg.file && !msg.link || msg.sender === 'user') && !msg.loading && (
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-xs break-words shadow text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-800 border'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            )}
                            {/* Loading bubble for MCP */}
                            {msg.loading && (
                                <div className="rounded-lg px-4 py-2 max-w-xs break-words shadow text-sm bg-gray-200 text-gray-600 flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    {msg.text}
                                </div>
                            )}
                            {/* Downloadable file bubble (only for LLM) */}
                            {msg.file && msg.sender === 'llm' && (
                                <div className="flex items-center max-w-xs bg-white border rounded-lg shadow px-4 py-2 gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-800 text-sm truncate">{msg.file.name}</div>
                                    </div>
                                    <a
                                        href={msg.file.url}
                                        download={msg.file.name}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs font-semibold"
                                    >
                                        ดาวน์โหลด
                                    </a>
                                </div>
                            )}
                            {/* Link bubble (for LLM, link or sos) */}
                            {msg.link && msg.sender === 'llm' && (
                                <a
                                    href={msg.link.url}
                                    className="flex items-center max-w-xs bg-white border rounded-lg shadow px-4 py-2 gap-3 hover:bg-blue-50 transition"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="text-2xl">🔗</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-blue-700 text-sm truncate underline">{msg.link.label}</div>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {/* Recommended messages header and list */}
            <div className="bg-gray-100 border-t">
                <div className="px-4 pt-3 pb-2 text-gray-700 font-semibold text-sm">คำถามที่ถูกถามบ่อย</div>
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                    {recommendedMessages.map((msg, idx) => (
                        <button
                            key={idx}
                            onClick={() => sendUserMessage(msg)}
                            className="bg-white border border-blue-400 text-blue-600 rounded-full px-4 py-1 text-sm hover:bg-blue-50 transition whitespace-nowrap"
                        >
                            {msg}
                        </button>
                    ))}
                </div>
            </div>
            {/* Input form */}
            <form
                onSubmit={handleSend}
                className="p-4 bg-white border-t flex gap-2 items-center"
                autoComplete="off"
            >
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 pr-10"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none"
                        tabIndex={-1}
                        aria-label="Voice input"
                    >
                        {/* New microphone icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="21px" version="1.1" viewBox="0 0 14 21" width="14px"><title /><desc /><defs /><g fill="none" fillRule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="#000000" id="Icons-AV" transform="translate(-3.000000, -43.000000)"><g id="mic" transform="translate(3.000000, 43.500000)"><path d="M7,12 C8.7,12 10,10.7 10,9 L10,3 C10,1.3 8.7,0 7,0 C5.3,0 4,1.3 4,3 L4,9 C4,10.7 5.3,12 7,12 L7,12 Z M12.3,9 C12.3,12 9.8,14.1 7,14.1 C4.2,14.1 1.7,12 1.7,9 L0,9 C0,12.4 2.7,15.2 6,15.7 L6,19 L8,19 L8,15.7 C11.3,15.2 14,12.4 14,9 L12.3,9 L12.3,9 Z" id="Shape" /></g></g></g></svg>
                    </button>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatPage;