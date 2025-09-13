'use client';

import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AppProviders from '@/components/providers/AppProviders';
import Navbar from '@/components/ui/navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/chat';

  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900">
        <AppProviders>
          {!hideNavbar && <Navbar />}
          <main className={`min-h-screen transition-all duration-300 ${hideNavbar ? '' : 'pt-16'}`}>
            <div className="">{children}</div>
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
