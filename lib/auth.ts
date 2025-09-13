// lib/auth.ts
export type Role = "guest" | "user" | "hr";

type DemoUser = { password: string; role: Exclude<Role, "guest"> };

// เดโม: คู่มือเข้าใช้งาน
// user / user123  → เห็นเฉพาะเนื้อหาที่พนักงานควรเห็น
// hr   / hr123    → เห็นทั้งหมด
const DEMO_USERS: Record<string, DemoUser> = {
  user: { password: "user123", role: "user" },
  hr: { password: "hr123", role: "hr" },
};

const STORAGE_KEY = "portal_auth_role";

export function getStoredRole(): Role {
  if (typeof window === "undefined") return "guest";
  return (localStorage.getItem(STORAGE_KEY) as Role) || "guest";
}

export function setStoredRole(role: Role) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, role);
}

export function clearStoredRole() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function loginWithPassword(id: string, password: string): Promise<Role> {
  // จำลองตรวจสอบแบบ synchronous สำหรับเดโม
  const u = DEMO_USERS[id];
  if (u && u.password === password) {
    setStoredRole(u.role);
    return u.role;
  }
  throw new Error("ID หรือรหัสผ่านไม่ถูกต้อง");
}
