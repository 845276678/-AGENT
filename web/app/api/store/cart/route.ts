import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/src/lib/client';
export async function GET(req: NextRequest){
  const token = req.cookies.get('auth_token')?.value;
  const headers = token ? { Authorization: `Bearer ${token}` } : {} as Record<string,string>;
  const { data, response } = await api.GET('/store/cart', { headers });
  return NextResponse.json(data, { status: response.status });
}
export async function POST(req: NextRequest){
  const body = await req.formData();
  const token = req.cookies.get('auth_token')?.value;
  const productId = body.get('productId');
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  await api.POST('/store/cart/add', { headers, body: { productId, quantity: 1 } });
  const url = new URL('/store', req.url);
  return NextResponse.redirect(url);
}