// app/layout.tsx
import '../styles/globals.css'; // หรือ '../styles/globals.css' ถ้าคุณเก็บไฟล์ไว้ที่เดิมจริงๆ
import type { ReactNode } from 'react';
import Navbar from '@/components/ui/navbar';
import AppProviders from '@/components/providers/AppProviders';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900">
        <AppProviders>
          <Navbar />
          <main className="min-h-screen transition-all duration-300 pt-16">
            <div className="p-6">{children}</div>
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
