import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0), // Hết hạn ngay lập tức
    path: '/',
  });
  return response;
}