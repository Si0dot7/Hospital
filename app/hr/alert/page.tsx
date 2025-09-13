"use client";
import { useEffect, useMemo, useState } from "react";
import type { RiskAlert, AlertStatus } from "@/lib/alerts";
import { loadAlerts, updateAlert, clearAlerts } from "@/lib/alerts";

export default function HrAlertsPage() {
    const [rows, setRows] = useState<RiskAlert[]>([]);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState<"all" | AlertStatus>("all");
    const [level, setLevel] = useState<"all" | "medium" | "high">("all");
    const [active, setActive] = useState<RiskAlert | null>(null);

    // โหลดข้อมูล
    useEffect(() => {
        setRows(loadAlerts());
    }, []);

    // ฟังก์ชันช่วยโหลดใหม่
    const refresh = () => setRows(loadAlerts());

    const filtered = useMemo(() => {
        return rows.filter(r => {
            if (status !== "all" && r.status !== status) return false;
            if (level !== "all" && r.level !== level) return false;
            if (q && !(r.text.toLowerCase().includes(q.toLowerCase()) || r.reasons.join(" ").includes(q.toLowerCase()))) return false;
            return true;
        });
    }, [rows, q, status, level]);

    const badge = (lv: string) =>
        lv === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";

    function setStatusFor(id: string, s: AlertStatus) {
        updateAlert(id, { status: s });
        refresh();
        if (active?.id === id) setActive({ ...active, status: s });
    }
    function setAssigneeFor(id: string, v: string) {
        updateAlert(id, { assignee: v });
        refresh();
        if (active?.id === id) setActive({ ...active, assignee: v });
    }
    function setNoteFor(id: string, v: string) {
        updateAlert(id, { note: v });
        refresh();
        if (active?.id === id) setActive({ ...active, note: v });
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">HR Alerts (ความเสี่ยง/ความเครียด)</h1>
                <button
                    className="border rounded-xl px-3 py-2 text-sm"
                    onClick={() => { clearAlerts(); refresh(); setActive(null); }}
                >
                    ล้างทั้งหมด
                </button>
            </div>

            {/* ตัวกรอง */}
            <div className="card p-4">
                <div className="grid md:grid-cols-4 gap-3">
                    <input
                        className="border rounded-xl px-3 py-2 text-sm"
                        placeholder="ค้นหาข้อความ/คีย์เวิร์ด..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <select
                        className="border rounded-xl px-3 py-2 text-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                    >
                        <option value="all">สถานะ: ทั้งหมด</option>
                        <option value="new">ใหม่</option>
                        <option value="ack">รับทราบ</option>
                        <option value="closed">ปิดเคส</option>
                    </select>
                    <select
                        className="border rounded-xl px-3 py-2 text-sm"
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                    >
                        <option value="all">ระดับ: ทั้งหมด</option>
                        <option value="high">สูง</option>
                        <option value="medium">กลาง</option>
                    </select>
                    <div className="px-4">
                        <a href="/" className="btn-primary text-center mx-3 border px-2 py-1 rounded-md bg-blue-600 text-white">ไปหน้าหลัก</a>
                        <a href="/chat" className="btn-primary text-center border px-2 py-1 rounded-md bg-blue-600 text-white">ไปหน้าแชต</a>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* ตาราง */}
                <div className="card p-4 md:col-span-2">
                    <table className="w-full text-sm">
                        <thead className="text-left border-b">
                            <tr>
                                <th className="p-2">เวลา</th>
                                <th className="p-2">ระดับ</th>
                                <th className="p-2">ข้อความ</th>
                                <th className="p-2">สถานะ</th>
                                <th className="p-2 text-right">เปิด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${badge(r.level)}`}>
                                            {r.level.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-2 truncate max-w-[320px]" title={r.text}>{r.text}</td>
                                    <td className="p-2">{r.status}</td>
                                    <td className="p-2 text-right">
                                        <button className="text-blue-600 hover:underline" onClick={() => setActive(r)}>
                                            ดูรายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td className="p-3 text-gray-500" colSpan={5}>ไม่มีแจ้งเตือน</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* แผงรายละเอียด/การดำเนินการ */}
                <div className="card p-4">
                    <h2 className="text-lg font-semibold mb-3">รายละเอียด</h2>
                    {!active ? (
                        <div className="text-sm text-gray-500">เลือกแถวจากตารางเพื่อดูรายละเอียด</div>
                    ) : (
                        <div className="space-y-3 text-sm">
                            <div><span className="text-gray-500">รหัส:</span> {active.id}</div>
                            <div><span className="text-gray-500">เวลา:</span> {new Date(active.createdAt).toLocaleString()}</div>
                            <div><span className="text-gray-500">ระดับ:</span> {active.level}</div>
                            <div>
                                <div className="text-gray-500">ข้อความผู้ใช้:</div>
                                <div className="p-2 border rounded-xl bg-gray-50">{active.text}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">คีย์เวิร์ดที่พบ:</div>
                                <div className="flex flex-wrap gap-2">
                                    {active.reasons.map((r, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full bg-gray-100">{r}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">มอบหมาย</label>
                                <input
                                    className="w-full border rounded-xl px-3 py-2"
                                    placeholder="เช่น ศิริพร (HR)"
                                    value={active.assignee || ""}
                                    onChange={(e) => setAssigneeFor(active.id, e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">บันทึก/หมายเหตุ</label>
                                <textarea
                                    className="w-full border rounded-xl px-3 py-2"
                                    rows={3}
                                    placeholder="สรุปการพูดคุย/การดำเนินการ/นัดหมาย..."
                                    value={active.note || ""}
                                    onChange={(e) => setNoteFor(active.id, e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                {active.status !== "ack" && (
                                    <button className="border rounded-xl px-3 py-2" onClick={() => setStatusFor(active.id, "ack")}>
                                        รับทราบ
                                    </button>
                                )}
                                {active.status !== "closed" && (
                                    <button className="btn-primary" onClick={() => setStatusFor(active.id, "closed")}>
                                        ปิดเคส
                                    </button>
                                )}
                            </div>
                            <div className="pt-2 border-t">
                                <a className="text-blue-600 hover:underline" href="/hr">เปิด HR Dashboard</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
