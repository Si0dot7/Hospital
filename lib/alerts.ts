// lib/alerts.ts
export type AlertLevel = "medium" | "high";
export type AlertStatus = "new" | "ack" | "closed";

export type RiskAlert = {
  id: string;
  level: AlertLevel;
  text: string;         // ข้อความที่ผู้ใช้พิมพ์
  reasons: string[];    // คำที่ทริกเกอร์
  createdAt: string;    // ISO
  origin?: "chat" | "form" | "other";
  userHint?: string;    // เช่น ชื่อ/แผนก (เดโมปล่อยว่าง)
  status: AlertStatus;
  assignee?: string;
  note?: string;        // หมายเหตุ HR
};

const KEY = "hr_alerts_v1";

function isClient() {
  return typeof window !== "undefined";
}

export function loadAlerts(): RiskAlert[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as RiskAlert[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveAlerts(list: RiskAlert[]) {
  if (!isClient()) return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addAlert(alert: Omit<RiskAlert, "id" | "createdAt" | "status"> & Partial<Pick<RiskAlert, "status">>) {
  if (!isClient()) return;
  const list = loadAlerts();
  const id = `ALT-${String(Math.floor(Math.random() * 900000) + 100000)}`;
  const createdAt = new Date().toISOString();
  const full: RiskAlert = {
    id,
    createdAt,
    status: "new",
    ...alert,
  } as RiskAlert;
  list.unshift(full);
  saveAlerts(list);
  return full;
}

export function updateAlert(id: string, patch: Partial<RiskAlert>) {
  const list = loadAlerts();
  const idx = list.findIndex((a) => a.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch };
    saveAlerts(list);
    return list[idx];
  }
  return null;
}

export function clearAlerts() {
  saveAlerts([]);
}
