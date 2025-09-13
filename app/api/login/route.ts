import { NextResponse } from 'next/server';

type Role = 'user' | 'hr';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  let role: Role | null = null;
  if (username === 'hr' && password === 'hr123') role = 'hr';
  else if (username === 'user' && password === 'user123') role = 'user';

  if (!role) {
    return NextResponse.json({ ok: false, error: 'invalid-credentials' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role });

  // หมายเหตุ: เพื่อความง่ายให้ client อ่าน role ได้ เราไม่ตั้ง httpOnly
  res.cookies.set('role', role, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 ชั่วโมง
    httpOnly: false,
  });

  return res;
}
