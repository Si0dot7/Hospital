'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

// ChatLayout provides a styled container for the chat app

import { useState } from 'react';

function ChatLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [showReport, setShowReport] = useState(false);
    const [reportText, setReportText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleReport = () => {
        setSubmitted(true);
        setTimeout(() => {
            setShowReport(false);
            setSubmitted(false);
            setReportText('');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-blue-800 text-white shadow p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="mr-2 p-2 rounded hover:bg-gray-200 focus:outline-none"
                        aria-label="Back to Home"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    {/* <img src="/logo.png" alt="Logo" className="h-8 w-8" /> */}
                    <span className="font-bold text-lg">คุณจุ๋ม ผู้ช่วย HR</span>
                </div>
                <button
                    className="p-2 rounded-full hover:bg-blue-700 bg-transparent text-white focus:outline-none"
                    onClick={() => setShowReport(true)}
                    aria-label="Report this conversation"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>

                </button>
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
            {/* Popup Modal */}
            {showReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                            onClick={() => setShowReport(false)}
                            aria-label="ปิด"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-bold mb-2">แจ้งปัญหาการสนทนา</h2>
                        <p className="mb-4 text-sm text-gray-600">รายงานปัญหานี้เพื่อให้เจ้าหน้าที่ HR ตรวจสอบ</p>
                        <textarea
                            className="w-full border rounded p-2 mb-4"
                            rows={4}
                            placeholder="โปรดระบุรายละเอียดปัญหา..."
                            value={reportText}
                            onChange={e => setReportText(e.target.value)}
                            disabled={submitted}
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            onClick={handleReport}
                            disabled={submitted || !reportText.trim()}
                        >
                            {submitted ? 'ส่งรายงานแล้ว' : 'ส่งรายงาน'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatLayout;