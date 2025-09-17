import { NextRequest, NextResponse } from 'next/server';
const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/v1';
function getSub(token?: string | null){
  if(!token) return null; const parts = token.split('.'); if(parts.length<2) return null;
  try{ const pad = '='.repeat((4 - (parts[1].length % 4)) % 4); return JSON.parse(Buffer.from(parts[1] + pad, 'base64').toString()).sub || 'u_demo'; }catch{ return 'u_demo'; }
}
export async function GET(req: NextRequest){
  const token = req.cookies.get('auth_token')?.value; const sub = getSub(token) || 'u_demo';
  const headers: Record<string,string> = token ? { Authorization: `Bearer ${token}` } : {};
  const r = await fetch(`${API}/users/${sub}/wallet/history`, { headers });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}