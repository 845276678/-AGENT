import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/src/lib/client';
export async function POST(req: NextRequest, { params }: { params: { itemId: string } }){
  const token = req.cookies.get('auth_token')?.value;
  const form = await req.formData();
  const method = (form.get('_method') || '').toString().toUpperCase();
  const headers: Record<string,string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (method === 'DELETE') {
    await api.DELETE('/store/cart/{itemId}', { params: { path: { itemId: params.itemId } }, headers });
  } else {
    await api.PUT('/store/cart/{itemId}', { params: { path: { itemId: params.itemId } }, headers, body: { quantity: 1 } });
  }
  return NextResponse.redirect(new URL('/store/cart', req.url));
}