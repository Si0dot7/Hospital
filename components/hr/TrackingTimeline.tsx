// components/hr/TrackingTimeline.tsx
"use client";

import { Button } from "@/components/ui/button";

type Props = {
  requestId?: string;
  steps?: string[];
  onBack?: () => void;
  onDownload?: () => void;
  onEmail?: () => void;
};

const DEFAULT_STEPS = [
  "ยื่นคำร้องแล้ว",
  "HR กำลังตรวจสอบ",
  "ขอเอกสารเพิ่มเติม (ถ้ามี)",
  "เสร็จสิ้น",
];

export default function TrackingTimeline({
  requestId,
  steps = DEFAULT_STEPS,
  onBack,
  onDownload,
  onEmail,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          สถานะคำร้อง: {requestId || "(ใส่เลขที่คำร้อง)"}
        </h2>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            ← กลับเมนู
          </Button>
        )}
      </div>

      <ol className="relative border-s-2 border-dashed ps-6">
        {steps.map((t, i) => (
          <li className="mb-6" key={i}>
            <span className="absolute -start-3 bg-white rounded-full p-1 border">
              {i + 1}
            </span>
            <p className="font-medium">{t}</p>
            {i === 0 && (
              <p className="text-gray-500 text-sm">
                ระบบรับคำร้องและออกเลขที่อัตโนมัติ
              </p>
            )}
            {i === 1 && (
              <p className="text-gray-500 text-sm">ใช้เวลาประมาณ 1–2 วันทำการ</p>
            )}
            {i === 2 && (
              <p className="text-gray-500 text-sm">
                อัปโหลดไฟล์กลับในหน้านี้ได้ทันที
              </p>
            )}
            {i === 3 && (
              <p className="text-gray-500 text-sm">ดาวน์โหลดเอกสารฉบับสมบูรณ์ได้</p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 flex gap-2">
        <Button onClick={onDownload}>📥 ดาวน์โหลดเอกสาร</Button>
        <Button variant="outline" onClick={onEmail}>
          📨 ส่งเอกสารเข้าอีเมล
        </Button>
      </div>
    </div>
  );
}
