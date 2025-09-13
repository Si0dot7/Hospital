'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // 👈 ใช้ Context สิทธิ์

type NavItem = {
  name: string;
  href: string;
  hrOnly?: boolean;     // แสดงเฉพาะ HR
  userOnly?: boolean;   // แสดงเฉพาะ user (และ hr ก็เห็นได้ถ้าอยาก ให้ไม่ใส่ userOnly)
  isLogout?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'บริการ', href: '/services' },
  { name: 'Chat', href: '/chat' },
  { name: 'Employee', href: '/employee', userOnly: true },
  { name: 'HR', href: '/hr', hrOnly: true },
  { name: 'HR Alerts', href: '/hr/alerts', hrOnly: true },
  { name: 'Setting', href: '/setting' },
  // Login/Logout จะเติมแบบไดนามิกด้านล่างตาม role
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { role, loading } = useAuth(); // role: "guest" | "user" | "hr"

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  // ปิดเมนูด้วย ESC
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  // ปิดเมนูเมื่อเปลี่ยนเส้นทาง
  useEffect(() => { setOpen(false); }, [pathname]);

  // กรองเมนูตามสิทธิ์
  const filteredItems = React.useMemo(() => {
    let items = NAV_ITEMS.filter((it) => {
      if (it.hrOnly) return role === 'hr';
      if (it.userOnly) return role === 'user' || role === 'hr';
      return true; // ใครๆ เห็นได้
    });

    // ต่อท้าย Login/Logout ตาม role
    if (!loading) {
      if (role === 'guest') {
        items = [...items, { name: 'Login', href: '/login' }];
      } else {
        items = [...items, { name: 'Logout', href: '/logout', isLogout: true }];
      }
    }
    return items;
  }, [role, loading]);

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-blue-800 text-white">
        <div className="mx-auto max-w-7xl h-16 px-4 flex items-center justify-between">
          {/* ซ้าย: Hamburger + HR + badge role */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10"
            >
              {open ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>

            <Link href={{ pathname: '/' }} className="text-lg font-semibold tracking-wide">
              HR
            </Link>

            {/* badge role */}
            {!loading && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/15">
                {role.toUpperCase()}
              </span>
            )}
          </div>

          {/* ขวา: Search, Aa, Bell */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-md hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
              </svg>
            </button>

            <button className="px-2 py-1 rounded-md hover:bg-white/10">
              <span className="text-base font-semibold leading-none">Aa</span>
            </button>

            <button className="p-2 rounded-md hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.4-1.4A2 2 0 0118 14.172V11a6 6 0 10-12 0v3.172a2 2 0 01-.6 1.428L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <nav className="py-3 flex flex-col h-full">
          <div className="px-4 pb-2 text-xs uppercase tracking-wider text-slate-400">Navigation</div>
          <div className="flex-1 space-y-1">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={{ pathname: item.href }}   // ใช้ UrlObject กัน type error
                className={`mx-2 flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${isActive(item.href)
                    ? 'bg-blue-700 text-white'
                    : item.isLogout
                      ? 'text-red-400 hover:bg-red-600 hover:text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
