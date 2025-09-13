"use client";
import { useState } from "react";
import EmployeeForm from "@/components/hr/EmployeeForm";
import { Card, CardContent } from "@/components/ui/card";
import type { RequestRow } from "@/lib/types";
import { initialRequests } from "@/lib/mockdata";
import { useRouter } from "next/navigation";
import type { Route } from "next";

export default function EmployeeFormPage() {
  const router = useRouter();
  const [rows, setRows] = useState<RequestRow[]>(initialRequests);

  function onSubmitNew(fd: FormData) {
    const type = String(fd.get("type"));
    const title = String(fd.get("title"));
    const details = String(fd.get("details") || "");
    const owner = String(fd.get("owner") || "ไม่ระบุ");

    const nextIdNum = Math.max(0, ...rows.map(r => parseInt(r.id.split("-")[1] || "0"))) + 1;
    const id = `REQ-${String(nextIdNum).padStart(4, "0")}`;

    const newRow: RequestRow = {
      id,
      type,
      owner,
      title,
      details,
      submitted: new Date().toISOString().slice(0, 10),
      sla: 2,
      status: "ใหม่",
      comments: ["ระบบรับคำร้องและออกเลขที่อัตโนมัติ"],
    };
    setRows([newRow, ...rows]);
    const href = `/employee/tracking?id=${id}` as Route<`/employee/tracking?id=${string}`>;
    router.push(href);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <title>
        คำร้องใหม่
      </title>
      <Card><CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ฟอร์มคำร้องใหม่</h2>
        </div>
        <EmployeeForm onSubmitNew={onSubmitNew} onCancel={() => history.back()} />
      </CardContent></Card>
    </div>
  );
}
