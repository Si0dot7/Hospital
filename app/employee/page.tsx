"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmployeePage() {
  const [trackingId, setTrackingId] = useState("REQ-1002");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👩‍💼 พนักงานทั่วไป</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl shadow-md md:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">ทำคำร้องใหม่</h3>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">เริ่มกรอกฟอร์มออนไลน์และติดตามสถานะได้ทันที</p>
              <Button variant="outline" onClick={() => history.back()}>
                ← กลับ
              </Button>
            </div>
            <Link
              href={{ pathname: "/employee/form" }}
              className="inline-flex items-center justify-center w-full py-6 rounded-2xl px-4 text-sm font-medium
         bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
         focus:ring-offset-2 transition"
            >
              📝 เปิดฟอร์ม
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">ติดตามสถานะคำร้อง</h3>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="ใส่เลขที่คำร้อง เช่น REQ-1002"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <Link
              href={{ pathname: "/employee/tracking", query: { id: trackingId || "" } }}
              className="inline-flex items-center justify-center w-full rounded-2xl px-4 py-2 text-sm font-medium
             bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
             focus:ring-offset-2 transition"
            >
              🔍 ดูสถานะ
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
