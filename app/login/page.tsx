'use client';

import * as React from 'react';
import { useState, FormEvent, useTransition, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Route } from 'next';

function toInternalRoute(path: string): Route {
  return path && path.startsWith('/') ? (path as Route) : ('/' as Route);
}

// ใช้ useSearchParams แค่ภายในคอมโพเนนต์ที่อยู่ใน <Suspense>
function useSafeFrom() {
  const raw = useSearchParams();
  const fromRaw = React.useMemo(() => raw.get('from') || '/', [raw]);

  return React.useMemo(() => {
    try {
      const url = new URL(fromRaw, 'http://dummy');
      const p = (url.pathname || '/') + (url.search || '') + (url.hash || '');
      if (p.startsWith('/') && p !== '/login') return p;
      return '/';
    } catch {
      if (fromRaw.startsWith('/') && fromRaw !== '/login') return fromRaw;
      return '/';
    }
  }, [fromRaw]);
}

export default function LoginPage() {
  // ⛑️ ครอบด้วย Suspense เพื่อ CSR bailout สำหรับ useSearchParams
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด…</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const { setRole } = useAuth();
  const safeFrom = useSafeFrom();
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'เข้าสู่ระบบ';
  }, []);

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

      const dest = toInternalRoute(safeFrom);
      startTransition(() => {
        router.replace(dest);
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
