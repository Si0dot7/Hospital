"use client";
import type { RequestRow } from "@/lib/types";

export default function HrTable({
  rows,
  activeId,
  onSelectRow,
}: {
  rows: RequestRow[];
  activeId?: string;
  onSelectRow: (r: RequestRow) => void;
}) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-left border-b">
          <tr>
            <th className="p-3">เลขที่</th>
            <th className="p-3">ประเภท</th>
            <th className="p-3">หัวข้อ</th>
            <th className="p-3">ผู้ยื่น</th>
            <th className="p-3">ไฟล์แนบ</th>
            <th className="p-3 text-right">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className={"border-b hover:bg-gray-50 cursor-pointer " + (activeId === r.id ? "bg-blue-50" : "")}
              onClick={() => onSelectRow(r)}
            >
              <td className="p-3 font-medium">{r.id}</td>
              <td className="p-3">{r.type}</td>
              <td className="p-3">{r.title ?? "-"}</td>
              <td className="p-3">{r.owner}</td>
              <td className="p-3">{r.attachments?.length ?? 0}</td>
              <td className="p-3 text-right">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
