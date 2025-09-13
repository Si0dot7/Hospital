"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, role } = useAuth();
  const router = useRouter();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(id.trim(), pw);
      // นำทางตามสิทธิ์
      router.replace(role === "hr" ? "/hr" : "/employee");
    } catch (e: any) {
      setErr(e?.message || "เข้าสู่ระบบไม่สำเร็จ");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded-2xl p-6 bg-white shadow">
        <h1 className="text-xl font-semibold mb-4">เข้าสู่ระบบ</h1>

        <label className="block text-sm mb-1">ไอดี</label>
        <input
          className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ป้อนไอดี"
          required
        />

        <label className="block text-sm mb-1">รหัสผ่าน</label>
        <input
          type="password"
          className="w-full border rounded-xl px-3 py-2 text-sm mb-4"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="ป้อนรหัสผ่าน"
          required
        />

        {err && <div className="text-sm text-red-600 mb-3">{err}</div>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-blue-600 text-white rounded-xl py-2 text-sm disabled:opacity-60"
        >
          {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </button>

        
      </form>
    </div>
  );
}
