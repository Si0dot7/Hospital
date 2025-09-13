import "../styles/globals.css";
import type { ReactNode } from "react";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="th"><body className="bg-gray-50 text-gray-900"><main className="min-h-screen">{children}</main></body></html>);
}
