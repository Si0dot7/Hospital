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
  { name: 'หน้าหลัก', href: '/main' },
  { name: 'บริการ', href: '/services' },
  { name: 'แชท', href: '/chat' },
  { name: 'คำร้องใหม่', href: '/employee', userOnly: true },
  { name: 'จัดการคำร้อง', href: '/hr', hrOnly: true },
  { name: 'HR Alerts', href: '/hr/alert', hrOnly: true },
  { name: 'การตั้งค่า', href: '/setting' },
  // Login/Logout จะเติมแบบไดนามิกด้านล่างตาม role
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  // mock state สำหรับแสดงผลใน popup (ไม่ไปเปลี่ยนจริง)
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(1);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontStyle, setFontStyle] = useState<'1' | '2'>('1');
  const { role, loading } = useAuth(); // role: "guest" | "user" | "hr"

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  // ปิดเมนู/ป๊อปอัพด้วย ESC
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setPrefsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  // ปิดเมนูเมื่อเปลี่ยนเส้นทาง
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        items = [...items, { name: 'เข้าสู่ระบบ', href: '/login' }];
      } else {
        items = [...items, { name: 'ออกจากระบบ', href: '/logout', isLogout: true }];
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12"  />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16"  />
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

            {/* Aa => เปิด Popup Preferences */}
            <button
              onClick={() => setPrefsOpen(true)}
              className="px-2 py-1 rounded-md hover:bg-white/10"
              aria-haspopup="dialog"
              aria-expanded={prefsOpen}
            >
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

      {/* Overlay สำหรับ Drawer */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="py-3 flex flex-col h-full">
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

      {/* ===== Popup Preferences (Mock-up) ===== */}
      {/* Backdrop */}
      <div
        aria-hidden={!prefsOpen}
        onClick={() => setPrefsOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          prefsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prefs-title"
        className={`fixed z-[61] top-20 right-4 w-[360px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all
          ${prefsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h2 id="prefs-title" className="text-base font-semibold text-slate-800">
              ตั้งค่าการแสดงผล
            </h2>
            <button
              className="p-2 -m-2 rounded-md text-slate-500 hover:bg-slate-100"
              onClick={() => setPrefsOpen(false)}
              aria-label="ปิดหน้าต่างตั้งค่า"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ขนาดตัวอักษร */}
          <div className="mt-4">
            <div className="text-sm font-medium text-slate-700">ขนาดตัวอักษร</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                className="h-10 w-12 rounded-lg border border-slate-300 hover:bg-slate-50"
                onClick={() => setFontSize((v) => Math.max(10, v - 1))}
              >
                –
              </button>
              <div className="h-10 flex-1 grid place-items-center rounded-lg border border-slate-300 text-slate-800">
                {fontSize}
              </div>
              <button
                className="h-10 w-12 rounded-lg border border-slate-300 hover:bg-slate-50"
                onClick={() => setFontSize((v) => Math.min(40, v + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* ระยะห่างระหว่างบรรทัด */}
          <div className="mt-4">
            <div className="text-sm font-medium text-slate-700">ระยะห่างระหว่างบรรทัด</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                className="h-10 w-12 rounded-lg border border-slate-300 hover:bg-slate-50"
                onClick={() => setLineHeight((v) => Math.max(1, v - 1))}
              >
                –
              </button>
              <div className="h-10 flex-1 grid place-items-center rounded-lg border border-slate-300 text-slate-800">
                {lineHeight}
              </div>
              <button
                className="h-10 w-12 rounded-lg border border-slate-300 hover:bg-slate-50"
                onClick={() => setLineHeight((v) => Math.min(4, v + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* สีพื้นหลัง / ธีม */}
          <div className="mt-5">
            <div className="text-sm font-medium text-slate-700">สีพื้นหลัง</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`h-14 rounded-xl border flex items-center justify-center gap-2 ${
                  theme === 'light' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-300'
                }`}
              >
                <span className="inline-block rounded-md bg-white border border-slate-300 px-2 py-1">Aa</span>
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`h-14 rounded-xl border flex items-center justify-center gap-2 ${
                  theme === 'sepia' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-300'
                }`}
                style={{ backgroundColor: '#fbf1e6' }}
              >
                <span className="inline-block rounded-md bg-[#fbf1e6] border border-slate-300 px-2 py-1">Aa</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`h-14 rounded-xl border flex items-center justify-center gap-2 ${
                  theme === 'dark' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-300'
                }`}
                style={{ backgroundColor: '#0a0a0a', color: 'white' }}
              >
                <span className="inline-block rounded-md bg-black text-white px-2 py-1">Aa</span>
              </button>
            </div>
          </div>

          {/* แบบตัวอักษร */}
          <div className="mt-5">
            <div className="text-sm font-medium text-slate-700">แบบตัวอักษร</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={() => setFontStyle('1')}
                className={`rounded-xl border px-4 py-3 text-sm ${
                  fontStyle === '1' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-300'
                }`}
              >
                แบบที่ 1
              </button>
              <button
                onClick={() => setFontStyle('2')}
                className={`rounded-xl border px-4 py-3 text-sm ${
                  fontStyle === '2' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-300'
                }`}
              >
                แบบที่ 2
              </button>
            </div>
          </div>

          {/* ปุ่มยืนยัน (ไม่ทำอะไร แค่ mock) */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700"
              onClick={() => setPrefsOpen(false)}
            >
              ยกเลิก
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setPrefsOpen(false)}
            >
              ใช้การตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
