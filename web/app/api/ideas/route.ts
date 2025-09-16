import { NextRequest, NextResponse } from 'next/server';
import { api, toNextJson } from '@/src/lib/client';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const headers: Record<string,string> = token ? { Authorization: `Bearer ${token}` } : {};
  const { body, status } = await toNextJson(api.GET('/ideas', { params: { query: { page: 1, pageSize: 20 } }, headers }));
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const body = await req.json();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const { body: b, status } = await toNextJson(api.POST('/ideas', { body, headers }));
  return NextResponse.json(b, { status });
}