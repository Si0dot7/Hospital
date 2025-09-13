// app/employee/tracking/page.tsx
'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TrackingPage() {
  // ✅ ครอบด้วย Suspense (ตามข้อกำหนด Next 15)
  return (
    <Suspense fallback={<div className="p-6">กำลังโหลด…</div>}>
      <TrackingInner />
    </Suspense>
  );
}

function TrackingInner() {
  const sp = useSearchParams();
  const id = sp.get('id') ?? '(ใส่เลขที่คำร้อง)';

  useEffect(() => {
    document.title = 'ติดตามสถานะคำร้อง';
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">สถานะคำร้อง: {id}</h2>
            <Button variant="outline" onClick={() => history.back()}>
              ← กลับ
            </Button>
          </div>

          <ol className="relative border-s-2 border-dashed ps-6">
            <li className="mb-6">
              <span className="absolute -start-3 bg-white rounded-full p-1 border">1</span>
              <p className="font-medium">ยื่นคำร้องแล้ว</p>
              <p className="text-gray-500 text-sm">ระบบรับคำร้องและออกเลขที่อัตโนมัติ</p>
            </li>
            <li className="mb-6">
              <span className="absolute -start-3 bg-white rounded-full p-1 border">2</span>
              <p className="font-medium">HR กำลังตรวจสอบ</p>
              <p className="text-gray-500 text-sm">ใช้เวลาประมาณ 1–2 วันทำการ</p>
            </li>
            <li className="mb-6">
              <span className="absolute -start-3 bg-white rounded-full p-1 border">3</span>
              <p className="font-medium">ขอเอกสารเพิ่มเติม (ถ้ามี)</p>
              <p className="text-gray-500 text-sm">อัปโหลดไฟล์กลับในหน้านี้ได้ทันที</p>
            </li>
            <li>
              <span className="absolute -start-3 bg-white rounded-full p-1 border">4</span>
              <p className="font-medium">เสร็จสิ้น</p>
              <p className="text-gray-500 text-sm">ดาวน์โหลดเอกสารฉบับสมบูรณ์ได้</p>
            </li>
          </ol>

          <div className="mt-4 flex gap-2">
            <Button>📥 ดาวน์โหลดเอกสาร</Button>
            <Button variant="outline">📨 ส่งเอกสารเข้าอีเมล</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">การแจ้งเตือน</h3>
          <ul className="text-sm text-gray-600 list-disc ps-5 space-y-2">
            <li>ระบบจะส่ง SMS/Email เมื่อสถานะเปลี่ยน</li>
            <li>ถ้าขอเอกสารเพิ่มจะมีลิงก์อัปโหลดให้ทันที</li>
            <li>กดติดตามผ่าน LINE Official ได้</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
