// lib/types.ts
export type Attachment = {
  id: string;
  name: string;        // เช่น "national_id.pdf"
  url: string;         // พาธ public เช่น "/samples/national_id.pdf"
  mime?: string;       // "application/pdf", "image/jpeg" ...
  size?: number;       // bytes
  uploadedAt?: string; // ISO string
};

export type RequestRow = {
  id: string;
  type: string;
  owner: string;
  title?: string;
  details?: string;
  submitted: string;
  sla: number;
  status: "ใหม่" | "กำลังตรวจสอบ" | "รอเอกสารเพิ่ม" | "เสร็จสิ้น";
  assignee?: string;
  comments?: string[];
  attachments?: Attachment[]; // ✅ ใช้แสดงพรีวิว
};
