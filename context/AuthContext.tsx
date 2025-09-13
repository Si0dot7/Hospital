"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Role } from "@/lib/auth";
import { getStoredRole, setStoredRole, clearStoredRole, loginWithPassword } from "@/lib/auth";

type AuthContextValue = {
  role: Role;
  loading: boolean;
  login: (id: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (r: Role) => void; // สำหรับเดโม/ทดสอบ
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRoleState(getStoredRole());
    setLoading(false);
  }, []);

  const setRole = useCallback((r: Role) => {
    setStoredRole(r);
    setRoleState(r);
  }, []);

  const login = useCallback(async (id: string, password: string) => {
    const r = await loginWithPassword(id, password);
    setRoleState(r);
  }, []);

  const logout = useCallback(() => {
    clearStoredRole();
    setRoleState("guest");
  }, []);

  return (
    <AuthContext.Provider value={{ role, loading, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
