// lib/safety.ts
export type RiskLevel = "none" | "low" | "medium" | "high";
export type RiskResult = { level: RiskLevel; reasons: string[] };

const SUICIDE_KEYWORDS = [
  // ไทย—ระวังเว้นวรรค/สะกดหลากหลาย
  "ฆ่าตัวตาย", "คิดสั้น", "ไม่อยากอยู่แล้ว", "อยากตาย", "จบๆไป", "ไม่มีค่า", "หายไปจากโลก",
  "ทำร้ายตัวเอง", "บาดเจ็บตัวเอง", "กรีดข้อมือ", "กินยาเกิน", "โดดตึก", "ผูกคอ",
  // อังกฤษที่พบบ่อยปนไทย
  "suicide", "kill myself", "end it", "i want to die", "self harm", "cut myself", "overdose",
];

const DEPRESSION_STRESS = [
  "เครียดมาก", "ไม่ไหวแล้ว", "หมดแรง", "หมดไฟ", "ซึมเศร้า", "นอนไม่หลับ", "ร้องไห้ตลอด",
  "burnout", "depress", "anxiety", "panic", "worthless"
];

// คำปฏิเสธเพื่อกัน false positive: "ไม่", "no", "ไม่คิด", "ไม่อยากตาย"
const NEGATIONS = ["ไม่", "no", "ไม่ได้", "ไม่คิด", "ไม่อยากตาย"];

// ตัวคูณความเข้มจากเครื่องหมาย/ตัวใหญ่/จำนวนตรงคำ
function intensityBoost(text: string, hits: number) {
  let score = hits;
  const exclam = (text.match(/!/g) || []).length;
  const caps = /[A-Zก-ฮ]{3,}/.test(text) ? 1 : 0; // มีตัวพิมพ์ใหญ่ติดกัน (ภาษาอังกฤษ) กำหนดบวกนิดหน่อย
  score += Math.min(exclam, 3) * 0.5 + caps * 0.5;
  return score;
}

function hasNegationNear(text: string, keyword: string) {
  // ตรวจ 12 ตัวอักษรก่อน/หลังคีย์เวิร์ดเพื่อดูมีคำปฏิเสธไหม
  const idx = text.indexOf(keyword);
  if (idx < 0) return false;
  const windowStart = Math.max(0, idx - 12);
  const windowEnd = Math.min(text.length, idx + keyword.length + 12);
  const window = text.slice(windowStart, windowEnd);
  return NEGATIONS.some(n => window.includes(n));
}

export function detectRisk(inputRaw: string): RiskResult {
  const text = (inputRaw || "").toLowerCase().trim();
  if (!text) return { level: "none", reasons: [] };

  let suicideHits = 0;
  let depHits = 0;
  const reasons: string[] = [];

  for (const k of SUICIDE_KEYWORDS) {
    if (text.includes(k.toLowerCase()) && !hasNegationNear(text, k.toLowerCase())) {
      suicideHits++; reasons.push(k);
    }
  }
  for (const k of DEPRESSION_STRESS) {
    if (text.includes(k.toLowerCase()) && !hasNegationNear(text, k.toLowerCase())) {
      depHits++; reasons.push(k);
    }
  }

  const suicideScore = intensityBoost(text, suicideHits);
  const depScore = intensityBoost(text, depHits);

  // กำหนดเกณฑ์
  if (suicideScore >= 1.5) return { level: "high", reasons };
  if (suicideScore >= 1 || depScore >= 2) return { level: "medium", reasons };
  if (depScore >= 1) return { level: "low", reasons };
  return { level: "none", reasons: [] };
}

// แหล่งช่วยเหลือ—แก้ให้ตรงองค์กรคุณ
export const CRISIS_RESOURCES = [
  { label: "ติดต่อ HR/สวัสดิการทันที", href: "/hr" },
  // แนะนำปรับตามประเทศ/นโยบายองค์กร (ตัวอย่างประเทศไทย)
  { label: "สายด่วนสุขภาพจิต 1323 (ไทย)", href: "tel:1323" },
  { label: "โรงพยาบาลใกล้คุณ (Google Maps)", href: "https://maps.google.com/?q=hospital" },
];
