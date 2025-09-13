import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'สำหรับข้าราชการบำนาญ',
}

export default function RetiredPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👨‍⚕️ ผู้สูงอายุ</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl shadow-md"><CardContent className="p-6">
          <h3 className="font-semibold mb-4">ตรวจสอบสิทธิ์</h3>
          <Button className="w-full py-6">ตรวจสิทธิ์เงินบำนาญ</Button>
          <Button variant="outline" className="w-full py-6 mt-3">ตรวจสิทธิ์รักษาพยาบาล</Button>
        </CardContent></Card>
        <Card className="rounded-2xl shadow-md"><CardContent className="p-6">
          <h3 className="font-semibold mb-4">ช่วยเหลือด่วน</h3>
          <Button className="w-full py-6">📞 ติดต่อเจ้าหน้าที่</Button>
        </CardContent></Card>
      </div>
    </div>
  );
}
