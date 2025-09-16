import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/src/lib/client';
export async function POST(req: NextRequest){
  const token = req.cookies.get('auth_token')?.value;
  const headers: Record<string,string> = token ? { Authorization: `Bearer ${token}` } : {};
  await api.POST('/store/purchase', { headers });
  return NextResponse.redirect(new URL('/store', req.url));
}