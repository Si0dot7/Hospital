'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

// ChatLayout provides a styled container for the chat app
function ChatLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
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
                    <span className="font-bold text-lg">ผู้ช่วย HR พี่จุ๋ม</span>
                </div>
                {/* <span className="text-gray-500 text-sm">Powered by LLM</span> */}
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}

export default ChatLayout;