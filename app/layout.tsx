import "../styles/globals.css";
import type { ReactNode } from "react";
import Navbar from "../components/ui/navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="min-h-screen transition-all duration-300 pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
