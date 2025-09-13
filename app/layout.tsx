'use client'
import "../styles/globals.css";
import type { ReactNode } from "react";
import Navbar from "../components/ui/navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const showNavbar = pathname !== "/chat";
  console.log(pathname, showNavbar);


  if (showNavbar) {
    return (
      <html lang="th">

        {/* normal */}
        <body className="bg-gray-50 text-gray-900">
          {showNavbar && <Navbar />}
          <main className="min-h-screen transition-all duration-300 pt-16">
            <div className="p-6">
              {children}
            </div>
          </main>
        </body>

      </html>
    )
  } else {
    return (
      <html lang="th">
        <body className="bg-gray-50 text-gray-900">
          {/* chat */}
          {children}
        </body>
      </html>

    )
  }
}
