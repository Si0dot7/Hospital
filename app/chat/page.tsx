"use client";
import React, { useState, useRef, useEffect } from "react";
import rules from "./llm_rules.json";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/safety";
import { addAlert } from "@/lib/alerts";

interface Message {
    id: number;
    sender: "user" | "llm";
    text: string;
    file?: { name: string; url: string };
    loading?: boolean;
    link?: { label: string; url: string };
}

type Rule = {
    question: string;
    answer: string;
    file?: { name: string; url: string };
    type?: "file" | "mcp" | "link" | "sos";
    link?: { label: string; url: string };
};

const initialMessages: Message[] = [
    { id: 1, sender: "llm", text: "สวัสดีค่ะคุณสมชาย มีอะไรให้จุ๋มช่วยคะวันนี้" },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const recommendedMessages = ["ฉันเหลือวันลาเท่าไหร่", "ขอเอกสารใบลาหน่อย", "ขอลิงก์ยื่นเอกสาร"];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getNextId = (msgs: Message[]) => (msgs.length > 0 ? Math.max(...msgs.map((m) => m.id)) + 1 : 1);

    // แทรกการ์ดช่วยเหลือ
    const pushCrisisCard = (urgent: boolean) => {
        setTimeout(() => {
            setMessages((msgs) => {
                const infoMsg: Message = {
                    id: getNextId(msgs),
                    sender: "llm",
                    text: urgent
                        ? "จุ๋มเป็นบอทนะคะ แต่ข้อความนี้ดูมีความเสี่ยง เราอยากให้คุณปลอดภัยก่อนเป็นอันดับแรก หากสะดวก ลองติดต่อช่องทางช่วยเหลือด้านล่างทันที"
                        : "ถ้าคุณกำลังเครียดมาก นี่คือช่องทางที่พร้อมช่วยเหลือคุณได้ค่ะ",
                };
                const withInfo = [...msgs, infoMsg];

                const linkBubbles: Message[] = CRISIS_RESOURCES.map((r) => ({
                    id: getNextId(withInfo),
                    sender: "llm",
                    text: "",
                    link: { label: r.label, url: r.href },
                }));

                return [...withInfo, ...linkBubbles];
            });
        }, 100);
    };

    // ส่งข้อความ
    const sendUserMessage = (text: string) => {
        // โชว์ข้อความผู้ใช้ก่อน
        setMessages((msgs) => [...msgs, { id: getNextId(msgs), sender: "user", text }]);

        // 1) ตรวจความเสี่ยง + แจ้ง HR
        const risk = detectRisk(text);

        if (risk.level === "high") {
            // ส่ง alert ไป HR
            addAlert({
                level: "high",
                text,
                reasons: risk.reasons,
                origin: "chat",
                userHint: "",
            });
            // แสดงการ์ดฉุกเฉิน แล้วหยุด flow ปกติ
            return pushCrisisCard(true);
        }

        const shouldAttachSupport = risk.level === "medium";
        if (shouldAttachSupport) {
            addAlert({
                level: "medium",
                text,
                reasons: risk.reasons,
                origin: "chat",
                userHint: "",
            });
        }

        // 2) เดิน rules ปกติ
        let llmResponse = "";
        let file: { name: string; url: string } | undefined;
        let type: "file" | "mcp" | "link" | "sos" | undefined;
        let link: { label: string; url: string } | undefined;

        const foundRule = (rules as Rule[]).find((r) => r.question === text);
        if (foundRule) {
            llmResponse = foundRule.answer;
            file = foundRule.file;
            type = foundRule.type;
            link = foundRule.link;
        } else {
            llmResponse = "ขออภัย จุ๋มยังไม่เข้าใจคำถามนี้ค่ะ";
        }

        if (type === "mcp") {
            setTimeout(() => {
                setMessages((msgs) => [
                    ...msgs,
                    { id: getNextId(msgs), sender: "llm", text: "กำลังหาข้อมูลที่เกี่ยวข้อง", loading: true },
                ]);
                setTimeout(() => {
                    setMessages((msgs) => {
                        const filtered = msgs.filter((m) => !m.loading);
                        return [...filtered, { id: getNextId(filtered), sender: "llm", text: llmResponse }];
                    });
                    if (shouldAttachSupport) pushCrisisCard(false);
                }, 1200);
            }, 800);
        } else if (type === "link" && link) {
            setTimeout(() => {
                setMessages((msgs) => {
                    const answerMsg: Message = { id: getNextId(msgs), sender: "llm", text: llmResponse };
                    const newMsgs = [...msgs, answerMsg];
                    const linkMsg: Message = { id: getNextId(newMsgs), sender: "llm", text: "", link };
                    return [...newMsgs, linkMsg];
                });
                if (shouldAttachSupport) pushCrisisCard(false);
            }, 800);
        } else if (type === "sos") {
            setTimeout(() => {
                setMessages((msgs) => {
                    const answerMsg: Message = { id: getNextId(msgs), sender: "llm", text: llmResponse };
                    const newMsgs = [...msgs, answerMsg];
                    const linkMsg: Message = {
                        id: getNextId(newMsgs),
                        sender: "llm",
                        text: "",
                        link: { label: "จองเวลาติดต่อเจ้าหน้าที่", url: "/hr" },
                    };
                    return [...newMsgs, linkMsg];
                });
                if (shouldAttachSupport) pushCrisisCard(false);
            }, 800);
        } else {
            // default
            setTimeout(() => {
                setMessages((msgs) => {
                    if (file) {
                        // Push text bubble, then file bubble
                        const textMsg: Message = { id: getNextId(msgs), sender: "llm", text: llmResponse };
                        const fileMsg: Message = { id: getNextId([...msgs, textMsg]), sender: "llm", text: "", file };
                        return [...msgs, textMsg, fileMsg];
                    } else {
                        const answerMsg: Message = { id: getNextId(msgs), sender: "llm", text: llmResponse };
                        return [...msgs, answerMsg];
                    }
                });
                if (shouldAttachSupport) pushCrisisCard(false);
            }, 800);
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendUserMessage(input.trim());
        setInput("");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`w-full flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex flex-col gap-1 items-${msg.sender === "user" ? "end" : "start"}`}>
                            {(msg.text && (!msg.file && !msg.link || msg.sender === "user") && !msg.loading) && (
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-xs break-words shadow text-sm ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 border"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            )}

                            {msg.loading && (
                                <div className="rounded-lg px-4 py-2 max-w-xs break-words shadow text-sm bg-gray-200 text-gray-600 flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    {msg.text}
                                </div>
                            )}

                            {msg.file && msg.sender === "llm" && !msg.text && (
                                <div className="flex items-center max-w-xs bg-white border rounded-lg shadow px-4 py-2 gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4m8 16H4" />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-800 text-sm truncate">{msg.file.name}</div>
                                    </div>
                                    <a href={msg.file.url} download={msg.file.name} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs font-semibold">
                                        ดาวน์โหลด
                                    </a>
                                </div>
                            )}

                            {msg.link && msg.sender === "llm" && (
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

            {/* FAQ quick chips */}
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

            {/* input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2 items-center" autoComplete="off">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 pr-10"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none" tabIndex={-1} aria-label="Voice input">
                        <svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 0 14 21" width="14px">
                            <g fill="#000000">
                                <path d="M7,12 C8.7,12 10,10.7 10,9 L10,3 C10,1.3 8.7,0 7,0 C5.3,0 4,1.3 4,3 L4,9 C4,10.7 5.3,12 7,12 Z M12.3,9 C12.3,12 9.8,14.1 7,14.1 C4.2,14.1 1.7,12 1.7,9 L0,9 C0,12.4 2.7,15.2 6,15.7 L6,19 L8,19 L8,15.7 C11.3,15.2 14,12.4 14,9 L12.3,9 L12.3,9 Z" />
                            </g>
                        </svg>
                    </button>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Send
                </button>
            </form>
        </div>
    );
}
