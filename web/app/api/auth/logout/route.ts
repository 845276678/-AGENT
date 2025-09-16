import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest){
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('auth_token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}