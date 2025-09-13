"use client";
import { useRef } from "react";
import type { RequestRow } from "@/lib/types";
import AttachmentList from "@/components/hr/AttachmentList";

export default function HrActions({
  activeRow,
  currentFilter,
  onChangeFilter,
  onChangeActive,
  onRequestMoreDocs,
  onCloseTask,
  onBulkApprove,
}: {
  activeRow?: RequestRow | null;
  currentFilter: string;
  onChangeFilter: (value: string) => void;
  onChangeActive: (patch: Partial<RequestRow>) => void;
  onRequestMoreDocs: () => void;
  onCloseTask: () => void;
  onBulkApprove: () => void;
}) {
  const commentRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="space-y-3 text-sm">
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

      <div>
        <label className="block text-sm font-medium mb-1">มอบหมายให้</label>
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="เช่น เจ้าหน้าที่: ศิริพร"
          onChange={(e) => activeRow && onChangeActive({ assignee: e.target.value })}
          disabled={!activeRow}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">เปลี่ยนสถานะ</label>
        <select
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={activeRow?.status || "ใหม่"}
          onChange={(e) => activeRow && onChangeActive({ status: e.target.value as RequestRow['status'] })}
          disabled={!activeRow}
        >
          <option>ใหม่</option>
          <option>กำลังตรวจสอบ</option>
          <option>รอเอกสารเพิ่ม</option>
          <option>เสร็จสิ้น</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">คอมเมนต์</label>
        <textarea
          ref={commentRef}
          className="w-full rounded-xl border px-3 py-2 text-sm"
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

      {activeRow && (
        <div className="pt-2 border-t">
          <AttachmentList attachments={activeRow.attachments} />
        </div>
      )}

      <div className="flex gap-2">
        <button className="border rounded-xl px-3 py-2" onClick={onRequestMoreDocs} disabled={!activeRow}>ขอเอกสารเพิ่ม</button>
        <button className="btn-primary" onClick={onCloseTask} disabled={!activeRow}>ปิดงาน</button>
      </div>

      <div className="pt-2 border-t">
        <button className="w-full border rounded-xl px-3 py-2" onClick={onBulkApprove}>Approve ทั้งหมดที่กรอง</button>
      </div>
    </div>
  );
}
