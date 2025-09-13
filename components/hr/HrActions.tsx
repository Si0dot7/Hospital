// components/hr/HrActions.tsx
"use client";

import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RequestRow } from "@/lib/types";
import { validateRequestDocs } from "@/lib/validators";

type Props = {
  activeRow?: RequestRow | null;
  currentFilter: string;
  onChangeFilter: (value: string) => void;
  onChangeActive: (patch: Partial<RequestRow>) => void;
  onRequestMoreDocs: () => void;
  onCloseTask: () => void;
  onBulkApprove: () => void;
};

export default function HrActions({
  activeRow,
  currentFilter,
  onChangeFilter,
  onChangeActive,
  onRequestMoreDocs,
  onCloseTask,
  onBulkApprove,
}: Props) {
  const commentRef = useRef<HTMLTextAreaElement>(null);

  
  const check = useMemo(
    () => (activeRow ? validateRequestDocs(activeRow) : null),
    [activeRow]
  );

  return (
    <div className="space-y-3 text-sm">
      {/* Filter */}
      <div>
        <label className="block text-sm font-medium mb-1">กรองสถานะ</label>
        <select
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
          value={currentFilter}
          onChange={(e) => onChangeFilter(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="ใหม่">ใหม่</option>
          <option value="กำลังตรวจสอบ">กำลังตรวจสอบ</option>
          <option value="รอเอกสารเพิ่ม">รอเอกสารเพิ่ม</option>
          <option value="เสร็จสิ้น">เสร็จสิ้น</option>
        </select>
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-sm font-medium mb-1">มอบหมายให้</label>
        <Input
          placeholder="เช่น เจ้าหน้าที่: ศิริพร"
          onChange={(e) => activeRow && onChangeActive({ assignee: e.target.value })}
          disabled={!activeRow}
        />
      </div>

      {/* Status change */}
      <div>
        <label className="block text-sm font-medium mb-1">เปลี่ยนสถานะ</label>
        <select
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
          value={activeRow?.status || "ใหม่"}
          onChange={(e) =>
            activeRow && onChangeActive({ status: e.target.value as RequestRow["status"] })
          }
          disabled={!activeRow}
        >
          <option>ใหม่</option>
          <option>กำลังตรวจสอบ</option>
          <option>รอเอกสารเพิ่ม</option>
          <option>เสร็จสิ้น</option>
        </select>
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium mb-1">คอมเมนต์</label>
        <textarea
          ref={commentRef}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
          rows={3}
          placeholder="บันทึกการดำเนินการ..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && activeRow) {
              e.preventDefault();
              const val = commentRef.current?.value.trim();
              if (val) {
                onChangeActive({ comments: [...(activeRow.comments || []), val] });
                if (commentRef.current) commentRef.current.value = "";
              }
            }
          }}
          disabled={!activeRow}
        />
        <p className="text-xs text-gray-500 mt-1">กด Enter เพื่อบันทึกอย่างรวดเร็ว</p>
      </div>

      {/* ----- Document checklist & validation ----- */}
      <div className="mt-2 p-3 border rounded-xl bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">สถานะเอกสาร</div>
          {check && (
            <span
              className={
                "text-xs px-2 py-0.5 rounded-full " +
                (check.isComplete
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700")
              }
            >
              {check.summary}
            </span>
          )}
        </div>

        {!activeRow && (
          <div className="text-xs text-gray-500">ยังไม่ได้เลือกคำร้องจากตาราง</div>
        )}

        {activeRow && check && !check.isComplete && (
          <div className="space-y-2">
            {check.missing.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">
                  รายการที่ยังขาด
                </div>
                <ul className="list-disc ps-5">
                  {check.missing.map((m) => (
                    <li key={m.key}>{m.label}</li>
                  ))}
                </ul>
              </div>
            )}
            {check.invalid.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">
                  ไฟล์ที่ไม่ผ่านเงื่อนไข
                </div>
                <ul className="list-disc ps-5">
                  {check.invalid.map((iv, idx) => (
                    <li key={idx}>
                      {iv.name} — {iv.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={onRequestMoreDocs} disabled={!activeRow}>
                ขอเอกสารเพิ่ม
              </Button>
              <Button
                onClick={() =>
                  onChangeActive({
                    comments: [
                      ...(activeRow?.comments || []),
                      "แจ้งผู้ยื่นให้อัปโหลดเอกสารที่ขาด",
                    ],
                  })
                }
                disabled={!activeRow}
              >
                แจ้งผู้ยื่น
              </Button>
            </div>
          </div>
        )}

        {activeRow && check && check.isComplete && (
          <div className="text-xs text-gray-600">
            เอกสารครบ สามารถดำเนินการ “ปิดงาน” ได้ทันที
          </div>
        )}
      </div>
      {/* ----- End document validation block ----- */}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRequestMoreDocs} disabled={!activeRow}>
          ขอเอกสารเพิ่ม
        </Button>
        <Button onClick={onCloseTask} disabled={!activeRow}>
          ปิดงาน
        </Button>
      </div>

      <div className="pt-2 border-t">
        <Button variant="outline" className="w-full" onClick={onBulkApprove}>
          Approve ทั้งหมดที่กรอง
        </Button>
      </div>
    </div>
  );
}
