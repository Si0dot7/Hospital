'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LogoutPage() {
  const router = useRouter();
  const { setRole } = useAuth();

  useEffect(() => {
    (async () => {
      await fetch('/api/logout', { method: 'POST' });
      setRole('guest');
      router.replace('/login');
    })();
  }, [router, setRole]);

  return <>
    <title>
      ออกจากระบบ
    </title>
    <div className="p-6">กำลังออกจากระบบ…</div>
  </>;
}
