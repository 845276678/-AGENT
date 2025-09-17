import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/src/lib/client';
export async function POST(req: NextRequest){
  const body = await req.json().catch(() => ({}));
  const { data, response } = await api.POST('/auth/login', { headers: { 'Content-Type': 'application/json' }, body });
  // The stub returns { data: { token } } or { token }
  const token = (data as any)?.data?.token || (data as any)?.token;
  const res = NextResponse.json(data, { status: response.status });
  if (token) {
    res.cookies.set('auth_token', token, { , secure: process.env.NODE_ENV === 'production' });
  }
  return res;
}