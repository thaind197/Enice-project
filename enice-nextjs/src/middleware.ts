import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Chỉ bảo vệ các đường dẫn bắt đầu bằng /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session');

    // Nếu chưa đăng nhập, đá về trang /login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

// Cấu hình để middleware không chặn các file tĩnh và API
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|key).*)',
  ],
};