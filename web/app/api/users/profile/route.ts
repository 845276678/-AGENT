import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/src/lib/client';
function getSub(token?: string | null){
  if(!token) return null; const parts = token.split('.'); if(parts.length<2) return null;
  try{ const pad = '='.repeat((4 - (parts[1].length % 4)) % 4); return JSON.parse(Buffer.from(parts[1] + pad, 'base64').toString()).sub || 'u_demo'; }catch{ return 'u_demo'; }
}
export async function GET(req: NextRequest){
  const token = req.cookies.get('auth_token')?.value; const sub = getSub(token) || 'u_demo';
  const headers: Record<string,string> = token ? { Authorization: `Bearer ${token}` } : {};
  const { data, error, response } = await api.GET('/users/{userId}/profile', { params: { path: { userId: sub } }, headers });
  return NextResponse.json(data ?? { error }, { status: response.status });
}
export async function PUT(req: NextRequest){
  const token = req.cookies.get('auth_token')?.value; const sub = getSub(token) || 'u_demo';
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const body = await req.json();
  const { data, error, response } = await api.PUT('/users/{userId}/profile', { params: { path: { userId: sub } }, body, headers });
  return NextResponse.json(data ?? { error }, { status: response.status });
}