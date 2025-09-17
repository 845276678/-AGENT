import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest){
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('auth_token', '', { , secure: process.env.NODE_ENV === 'production' });
  return res;
}