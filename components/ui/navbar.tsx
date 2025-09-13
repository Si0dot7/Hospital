'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // 👈 ใช้ Context สิทธิ์
import Logo from '../../public/image/logo2.png'
import Image from 'next/image';

type NavItem = {
  name: string;
  href: string;
  hrOnly?: boolean;     // แสดงเฉพาะ HR
  userOnly?: boolean;   // แสดงเฉพาะ user (และ hr ก็เห็นได้ถ้าอยาก ให้ไม่ใส่ userOnly)
  isLogout?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { name: 'หน้าหลัก', href: '/' },
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>

            <Link href={{ pathname: '/' }} className="text-lg font-semibold tracking-wide">
              <Image src={Logo} height={50} alt={'mahidol logo'} />
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
            <Link href={'/search'}>
              <button className="p-2 rounded-md hover:bg-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                </svg>
              </button>
            </Link>

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
        className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'
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

      {/* ===== Popup Preferences (Mock-up) - Using Inline Styles ===== */}
      {/* Backdrop */}
      <div
        aria-hidden={!prefsOpen}
        onClick={() => setPrefsOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          transition: 'opacity 0.3s ease',
          opacity: prefsOpen ? 1 : 0,
          pointerEvents: prefsOpen ? 'auto' : 'none'
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prefs-title"
        style={{
          position: 'fixed',
          zIndex: 61,
          top: '80px',
          right: '16px',
          width: '360px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          opacity: prefsOpen ? 1 : 0,
          transform: prefsOpen ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: prefsOpen ? 'auto' : 'none'
        }}
      >
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <h2
              id="prefs-title"
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
                lineHeight: '24px'
              }}
            >
              ตั้งค่าการแสดงผล
            </h2>
            <button
              onClick={() => setPrefsOpen(false)}
              aria-label="ปิดหน้าต่างตั้งค่า"
              style={{
                padding: '8px',
                margin: '-8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ขนาดตัวอักษร */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              ขนาดตัวอักษร
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setFontSize((v) => Math.max(10, v - 1))}
                style={{
                  height: '40px',
                  width: '48px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                –
              </button>
              <div style={{
                height: '40px',
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                color: '#1f2937',
                backgroundColor: '#ffffff'
              }}>
                {fontSize}
              </div>
              <button
                onClick={() => setFontSize((v) => Math.min(40, v + 1))}
                style={{
                  height: '40px',
                  width: '48px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                +
              </button>
            </div>
          </div>

          {/* ระยะห่างระหว่างบรรทัด */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              ระยะห่างระหว่างบรรทัด
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setLineHeight((v) => Math.max(1, v - 1))}
                style={{
                  height: '40px',
                  width: '48px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                –
              </button>
              <div style={{
                height: '40px',
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                color: '#1f2937',
                backgroundColor: '#ffffff'
              }}>
                {lineHeight}
              </div>
              <button
                onClick={() => setLineHeight((v) => Math.min(4, v + 1))}
                style={{
                  height: '40px',
                  width: '48px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                +
              </button>
            </div>
          </div>

          {/* สีพื้นหลัง / ธีม */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
              สีพื้นหลัง
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <button
                onClick={() => setTheme('light')}
                style={{
                  height: '56px',
                  borderRadius: '12px',
                  border: theme === 'light' ? '2px solid #2563eb' : '1px solid #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  boxShadow: theme === 'light' ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  padding: '4px 8px',
                  fontSize: '14px'
                }}>
                  Aa
                </span>
              </button>

              <button
                onClick={() => setTheme('sepia')}
                style={{
                  height: '56px',
                  borderRadius: '12px',
                  border: theme === 'sepia' ? '2px solid #2563eb' : '1px solid #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#fbf1e6',
                  boxShadow: theme === 'sepia' ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  borderRadius: '6px',
                  backgroundColor: '#fbf1e6',
                  border: '1px solid #d1d5db',
                  padding: '4px 8px',
                  fontSize: '14px'
                }}>
                  Aa
                </span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                style={{
                  height: '56px',
                  borderRadius: '12px',
                  border: theme === 'dark' ? '2px solid #2563eb' : '1px solid #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#0a0a0a',
                  color: '#ffffff',
                  boxShadow: theme === 'dark' ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  borderRadius: '6px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  padding: '4px 8px',
                  fontSize: '14px'
                }}>
                  Aa
                </span>
              </button>
            </div>
          </div>

          {/* แบบตัวอักษร */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
              แบบตัวอักษร
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <button
                onClick={() => setFontStyle('1')}
                style={{
                  borderRadius: '12px',
                  border: fontStyle === '1' ? '2px solid #2563eb' : '1px solid #d1d5db',
                  padding: '12px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  boxShadow: fontStyle === '1' ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                แบบที่ 1
              </button>
              <button
                onClick={() => setFontStyle('2')}
                style={{
                  borderRadius: '12px',
                  border: fontStyle === '2' ? '2px solid #2563eb' : '1px solid #d1d5db',
                  padding: '12px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  boxShadow: fontStyle === '2' ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                แบบที่ 2
              </button>
            </div>
          </div>

          {/* ปุ่มยืนยัน */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => setPrefsOpen(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              ยกเลิก
            </button>
            <button
              onClick={() => setPrefsOpen(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
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