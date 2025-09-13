"use client";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import HrTable from "@/components/hr/HrTable";
import HrActions from "@/components/hr/HrActions";
import type { RequestRow } from "@/lib/types";
import { initialRequests, trendData } from "@/lib/mockdata";

export default function HRPage() {
  const [rows, setRows] = useState<RequestRow[]>(initialRequests);
  const [active, setActive] = useState<RequestRow | null>(null);
  const [filter, setFilter] = useState<string>("ทั้งหมด");

  const filtered = useMemo(
    () => rows.filter(r => (filter === "ทั้งหมด" ? true : r.status === (filter as any))),
    [rows, filter]
  );

  function updateActive(patch: Partial<RequestRow>) {
    if (!active) return;
    setRows(prev => prev.map(r => (r.id === active.id ? { ...r, ...patch } : r)));
    setActive(prev => (prev ? { ...prev, ...patch } : prev));
  }

  function onBulkApprove() {
    setRows(prev =>
      prev.map(r =>
        filtered.some(f => f.id === r.id)
          ? { ...r, status: "เสร็จสิ้น", comments: [...(r.comments || []), "ปิดงานโดย HR"] }
          : r
      )
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-gray-500">คำร้องใหม่วันนี้</p><p className="text-3xl font-bold">35</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-gray-500">กำลังตรวจสอบ</p><p className="text-3xl font-bold">{rows.filter(r => r.status === "กำลังตรวจสอบ").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-gray-500">เกิน SLA</p><p className="text-3xl font-bold text-red-600">{rows.filter(r => r.sla < 2).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-gray-500">อัตราปิดงาน</p><p className="text-3xl font-bold text-green-600">{Math.round((rows.filter(r => r.status === "เสร็จสิ้น").length / rows.length) * 100)}%</p></CardContent></Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">ปริมาณคำร้องรายวัน</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="ทั้งหมด" fill="#60a5fa" />
                <Bar dataKey="done" name="เสร็จสิ้น" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Actions */}
        <Card><CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">จัดการคำร้อง</h2>
          <HrActions
            activeRow={active}
            currentFilter={filter}
            onChangeFilter={setFilter}
            onChangeActive={updateActive}
            onRequestMoreDocs={() =>
              active && updateActive({ status: "รอเอกสารเพิ่ม", comments: [...(active.comments || []), "ร้องขอเอกสารเพิ่มเติม"] })
            }
            onCloseTask={() =>
              active && updateActive({ status: "เสร็จสิ้น", comments: [...(active.comments || []), "ปิดงานแล้ว"] })
            }
            onBulkApprove={onBulkApprove}
          />
        </CardContent></Card>

        {/* Table */}
        <Card className="md:col-span-2"><CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">รายการคำร้อง</h2>
            <div className="text-sm text-gray-500">เลือกแถวเพื่อแก้ไข</div>
          </div>
          <HrTable rows={filtered} activeId={active?.id} onSelectRow={setActive} />
        </CardContent></Card>
      </div>
    </div>
  );
}
