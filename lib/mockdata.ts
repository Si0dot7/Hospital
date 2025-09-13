// lib/mockdata.ts
import type { RequestRow } from "./types";

export const initialRequests: RequestRow[] = [
  {
    id: "REQ-1001",
    type: "หนังสือรับรอง",
    owner: "กานดา",
    submitted: "2025-09-10",
    sla: 2,
    status: "ใหม่",
    title: "ขอหนังสือรับรองรายได้",
    attachments: [
      { id: "a1", name: "national_id.pdf", url: "/samples/national_id.pdf", mime: "application/pdf", size: 350_000 },
      { id: "a2", name: "request_form.pdf", url: "/samples/request_form.pdf", mime: "application/pdf", size: 420_000 },
    ],
  },
  {
    id: "REQ-1002",
    type: "ต่อใบอนุญาต",
    owner: "พงษ์",
    submitted: "2025-09-10",
    sla: 3,
    status: "กำลังตรวจสอบ",
    title: "ต่อใบอนุญาตประกอบวิชาชีพ",
    attachments: [
      { id: "b1", name: "license_copy.pdf", url: "/samples/license_copy.pdf", mime: "application/pdf", size: 800_000 },
      { id: "b2", name: "payment_slip.pdf", url: "/samples/payment_slip.pdf", mime: "application/pdf", size: 300_000 },
    ],
  },
  {
    id: "REQ-1003",
    type: "หนังสือรับรอง",
    owner: "สมชาย",
    submitted: "2025-09-09",
    sla: 1,
    status: "เสร็จสิ้น",
    title: "ขอหนังสือรับรองการทำงาน",
    attachments: [
      { id: "c1", name: "national_id.pdf", url: "/samples/national_id.pdf", mime: "application/pdf", size: 500_000 },
    ],
  },
];

// ✅ mock ข้อมูลกราฟ (จันทร์–ศุกร์)
export const trendData = [
  { day: "จ", total: 22, done: 12 },
  { day: "อ", total: 28, done: 18 },
  { day: "พ", total: 30, done: 19 },
  { day: "พฤ", total: 26, done: 17 },
  { day: "ศ", total: 35, done: 26 },
];
