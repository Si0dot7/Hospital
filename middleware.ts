import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/api/login',
  '/api/logout',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/samples',        // ถ้ามีไฟล์เดโม่ให้ดาวน์โหลด
];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // อนุญาต asset/static ของ Next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // อนุญาตเส้นทาง public
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ตรวจคุกกี้ role
  const role = req.cookies.get('role')?.value;
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname + (searchParams.toString() ? `?${searchParams}` : ''));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // จับทุกเส้นทาง (ยกเว้นไฟล์ระบบ)
  matcher: ['/((?!_next|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map)).*)'],
};
