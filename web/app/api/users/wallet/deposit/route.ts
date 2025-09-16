import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/src/lib/client';
function getSub(token?: string | null){
  if(!token) return null; const parts = token.split('.'); if(parts.length<2) return null;
  try{ const pad = '='.repeat((4 - (parts[1].length % 4)) % 4); return JSON.parse(Buffer.from(parts[1] + pad, 'base64').toString()).sub || 'u_demo'; }catch{ return 'u_demo'; }
}
export async function POST(req: NextRequest){
  const token = req.cookies.get('auth_token')?.value; const sub = getSub(token) || 'u_demo';
  const body = await req.json().catch(() => ({}));
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const { data, response } = await api.POST('/users/{userId}/wallet/deposit', { params: { path: { userId: sub } }, headers, body });
  return NextResponse.json(data, { status: response.status });
}