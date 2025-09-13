import type { Attachment, RequestRow } from "./types";
import { REQUIRED_BY_TYPE } from "./requirements";

function extOf(name: string) {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

export type DocCheckResult = {
  isComplete: boolean;
  missing: { key: string; label: string }[];
  invalid: { name: string; reason: string }[];
  summary: string; // สรุปสั้น ๆ
};

export function validateRequestDocs(req: RequestRow): DocCheckResult {
  const reqs = REQUIRED_BY_TYPE[req.type] ?? [];
  const atts = req.attachments ?? [];

  const missing: { key: string; label: string }[] = [];
  const invalid: { name: string; reason: string }[] = [];

  // map โดย key → ไฟล์แรกที่จับคู่ชื่อคร่าว ๆ (ปรับกฎได้ตามจริง)
  const byKey: Record<string, Attachment | undefined> = {};
  for (const r of reqs) {
    byKey[r.key] = atts.find(a => a.name.toLowerCase().includes(r.key.replace(/_/g,"-")));
  }

  for (const r of reqs) {
    const a = byKey[r.key];
    if (!a) {
      missing.push({ key: r.key, label: r.label });
      continue;
    }
    // ตรวจชนิดไฟล์
    const ex = extOf(a.name);
    if (r.accept.length && !r.accept.includes(ex)) {
      invalid.push({ name: a.name, reason: `ชนิดไฟล์ไม่ถูกต้อง (ต้องเป็น: ${r.accept.join(", ")})` });
      continue;
    }
    // ตรวจขนาด
    if (r.maxSizeMB && typeof a.size === "number" && a.size > r.maxSizeMB * 1024 * 1024) {
      invalid.push({ name: a.name, reason: `ไฟล์ใหญ่เกิน ${r.maxSizeMB}MB` });
      continue;
    }
    // (ออปชัน) ตรวจเนื้อหาเพิ่มเติมในอนาคต เช่น OCR/regex
    // if (r.contentHint) { ... }
  }

  const isComplete = missing.length === 0 && invalid.length === 0;
  const summary = isComplete
    ? "เอกสารครบ"
    : `เอกสารไม่ครบ: ขาด ${missing.length} รายการ, มีไฟล์ผิดเงื่อนไข ${invalid.length} ไฟล์`;

  return { isComplete, missing, invalid, summary };
}
