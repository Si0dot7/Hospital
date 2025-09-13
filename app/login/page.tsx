'use client';

import * as React from 'react';
import { useState, FormEvent, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function useSafeFrom() {
  const raw = useSearchParams();

  // อ่านครั้งเดียวเป็นสตริงปกติ (กัน Next 15 sync dynamic api)
  const fromRaw = React.useMemo(() => raw.get('from') || '/', [raw]);

  // ทำความสะอาดให้เป็น internal path เท่านั้น
  return React.useMemo(() => {
    try {
      // รองรับกรณีผู้ใช้ส่งเป็น URL เต็ม เข้าทาง dummy origin แล้วดึง path+query ออก
      const url = new URL(fromRaw, 'http://dummy');
      const p = (url.pathname || '/') + (url.search || '') + (url.hash || '');
      // อนุญาตแค่ path ภายใน และไม่ใช่ /login เอง
      if (p.startsWith('/') && p !== '/login') return p;
      return '/';
    } catch {
      // กรณี fromRaw ไม่ใช่ URL: ยอมเฉพาะที่ขึ้นต้นด้วย '/' และไม่ใช่ /login
      if (fromRaw.startsWith('/') && fromRaw !== '/login') return fromRaw;
      return '/';
    }
  }, [fromRaw]);
}

export default function LoginPage() {
  const router = useRouter();
  const safeFrom = useSafeFrom();
  const { setRole } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        let msg = 'เข้าสู่ระบบไม่สำเร็จ';
        try { msg = (await res.json())?.error || msg; } catch {}
        setErr(msg);
        return;
      }

      const j = await res.json(); // { ok: true, role: 'user' | 'hr' }
      if (!j?.role) {
        setErr('รูปแบบการตอบกลับไม่ถูกต้อง');
        return;
      }

      setRole(j.role);

      // ใช้ startTransition ให้เนียน และรับประกันเป็น path ภายใน
      startTransition(() => {
        router.replace(safeFrom || '/');
        // กันกรณี middleware ยังรีเฟรชไม่ทัน: refresh หน้านั้น
        router.refresh();
      });
    } catch {
      setErr('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold text-center mb-6">เข้าสู่ระบบ</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">ชื่อผู้ใช้</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ป้อนไอดี"
              autoFocus
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ป้อนรหัสผ่าน"
              autoComplete="current-password"
            />
          </div>

          {err && <div className="text-red-600 text-sm" role="alert">{err}</div>}

          <button
            type="submit"
            disabled={loading || isPending || !username || !password}
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading || isPending ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
          </button>

          <div className="text-xs text-gray-500 mt-2">
            <code>user/user123</code> หรือ <code>hr/hr123</code>
          </div>
        </form>
      </div>
    </div>
  );
}
