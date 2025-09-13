"use client";
import React from "react";
import type { Role } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AuthGate({
  allow,
  children,
  fallback,
}: {
  allow: Role[];                 // บทบาทที่อนุญาต เช่น ["hr"]
  children: React.ReactNode;     // เนื้อหาที่อนุญาต
  fallback?: React.ReactNode;    // ถ้าไม่ผ่านสิทธิ์จะแสดงอะไร (ถ้าไม่ส่ง → แสดง default)
}) {
  const { role, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">กำลังตรวจสอบสิทธิ์…</div>;
  }

  if (allow.includes(role)) {
    return <>{children}</>;
  }

  // ถ้าไม่ผ่านสิทธิ์
  return (
    fallback ?? (
      <div className="p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-2">ต้องเข้าสู่ระบบ</h2>
        <p className="text-sm text-gray-600 mb-3">
          โปรดเข้าสู่ระบบด้วยสิทธิ์ที่ถูกต้องเพื่อเข้าหน้านี้
        </p>
        <Link href={{ pathname: "/login" }} className="text-blue-600 hover:underline">
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    )
  );
}
