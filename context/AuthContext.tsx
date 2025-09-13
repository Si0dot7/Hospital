'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Role = 'guest' | 'user' | 'hr';
type Ctx = { role: Role; setRole: (r: Role) => void; loading: boolean };

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // อ่านจาก cookie: role
    const m = document.cookie.match(/(?:^|; )role=([^;]+)/);
    const r = m ? (decodeURIComponent(m[1]) as Role) : 'guest';
    setRole(r);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
