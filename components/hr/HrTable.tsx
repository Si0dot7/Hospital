// components/hr/HrTable.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { RequestRow } from "@/lib/types";

type Props = {
  rows: RequestRow[];
  activeId?: string;
  onSelectRow: (row: RequestRow) => void;
};

export default function HrTable({ rows, activeId, onSelectRow }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>เลขที่</TableHead>
          <TableHead>ประเภท</TableHead>
          <TableHead>หัวข้อ</TableHead>
          <TableHead>ผู้ยื่น</TableHead>
          <TableHead>ยื่นเมื่อ</TableHead>
          <TableHead>SLA (วัน)</TableHead>
          <TableHead className="text-right">สถานะ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow
            key={r.id}
            className={activeId === r.id ? "bg-blue-50 cursor-pointer" : "cursor-pointer"}
            onClick={() => onSelectRow(r)}
          >
            <TableCell className="font-medium">{r.id}</TableCell>
            <TableCell>{r.type}</TableCell>
            <TableCell>{r.title || "-"}</TableCell>
            <TableCell>{r.owner}</TableCell>
            <TableCell>{r.submitted}</TableCell>
            <TableCell>{r.sla}</TableCell>
            <TableCell className="text-right">
              <Badge variant={r.status === "เสร็จสิ้น" ? "secondary" : r.status === "ใหม่" ? "default" : "outline"}>
                {r.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
