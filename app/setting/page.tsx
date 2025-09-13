"use client";

import React from "react";
import Head from "next/head";
import { Mail, MessageSquare, Smartphone } from "lucide-react";

// Settings Page
// Path: /app/settings/page.tsx (Next.js App Router)
// Theme accent: dark blue

export default function SettingsPage() {
  // --- Mock account data ---
  const [name, setName] = React.useState("สมชาย ใจดี");
  const [dob, setDob] = React.useState<string>("2003-02-14"); // YYYY-MM-DD
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");

  // derive age from dob
  const age = React.useMemo(() => calcAge(dob), [dob]);

  // --- Notification toggles ---
  const [notify, setNotify] = React.useState({ sms: true, line: false, gmail: true });

  const handleSave = () => {
    // Mock save
    console.log("Saving settings:", { name, dob, gender, age, notify });
    alert("บันทึกข้อมูลสำเร็จ");
  };

  return (
    <>
      {/* <Head> */}
      <title>การตั้งค่า</title>
      {/* </Head> */}

      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-blue-900">Settings</h1>
        <p className="mb-6 text-sm text-slate-600">ตั้งค่าบัญชีและการแจ้งเตือน</p>

        {/* Account Section */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-blue-800/20 bg-white shadow-sm">
          <header className="flex items-center justify-between gap-4 border-b border-blue-800/20 bg-gradient-to-r from-blue-900 to-blue-800 px-5 py-4 text-blue-50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700/70 ring-1 ring-blue-300/30 shadow-sm">
                <span className="text-[10px] font-black tracking-wider">ACC</span>
              </div>
              <h2 className="text-base font-semibold">Account</h2>
            </div>
            <span className="text-xs opacity-80">ข้อมูลผู้ใช้</span>
          </header>

          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">ชื่อ</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">วันเดือนปีเกิด</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">เพศ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่น ๆ</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">อายุ</label>
              <input
                readOnly
                value={Number.isFinite(age) ? age : "-"}
                className="w-full cursor-not-allowed rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-slate-900"
              />
            </div>
          </div>
        </section>

        {/* Notification Section */}
        <section className="overflow-hidden rounded-2xl border border-blue-800/20 bg-white shadow-sm">
          <header className="flex items-center justify-between gap-4 border-b border-blue-800/20 bg-gradient-to-r from-blue-900 to-blue-800 px-5 py-4 text-blue-50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700/70 ring-1 ring-blue-300/30 shadow-sm">
                <span className="text-[10px] font-black tracking-wider">NOTI</span>
              </div>
              <h2 className="text-base font-semibold">Notification</h2>
            </div>
            <span className="text-xs opacity-80">ช่องทางการแจ้งเตือน</span>
          </header>

          <div className="p-5 space-y-3">
            <ToggleRow
              label="sms"
              desc="ส่งข้อความแจ้งเตือนผ่านเครือข่ายมือถือ"
              icon={Smartphone}
              active={notify.sms}
              onChange={() => setNotify((n) => ({ ...n, sms: !n.sms }))}
            />
            <ToggleRow
              label="line"
              desc="รับการแจ้งเตือนผ่าน LINE"
              icon={MessageSquare}
              active={notify.line}
              onChange={() => setNotify((n) => ({ ...n, line: !n.line }))}
            />
            <ToggleRow
              label="gmail"
              desc="ส่งอีเมลแจ้งเตือนไปยัง Gmail"
              icon={Mail}
              active={notify.gmail}
              onChange={() => setNotify((n) => ({ ...n, gmail: !n.gmail }))}
            />

            <div className="flex justify-end pt-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600/60 bg-blue-800/90 px-4 py-2 text-sm font-semibold text-blue-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300/60 active:translate-y-0"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function ToggleRow({ label, desc, icon: Icon, active, onChange }: { label: string; desc?: string; icon?: React.ComponentType<{ className?: string }>; active?: boolean; onChange?: () => void }) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm transition hover:bg-slate-50 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-300">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 transition group-hover:bg-blue-100">
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <div>
          <div className="text-sm font-semibold capitalize text-slate-800">{label}</div>
          {desc ? <div className="text-xs text-slate-500">{desc}</div> : null}
        </div>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={!!active}
          onChange={onChange}
          className="peer sr-only"
          role="switch"
          aria-checked={!!active}
          aria-label={label}
        />
        <div className="peer h-7 w-12 rounded-full bg-slate-300 transition before:absolute before:top-0.5 before:left-0.5 before:h-6 before:w-6 before:rounded-full before:bg-white before:shadow before:transition-all peer-checked:bg-blue-600 peer-checked:before:translate-x-5"></div>
      </label>
    </div>
  );
}

function calcAge(dob: string): number {
  if (!dob) return NaN as any;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return NaN as any;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}
