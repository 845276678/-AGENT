import { NextResponse } from 'next/server';
import { api, toNextJson } from '@/src/lib/client';
export async function GET(){
  const { body, status } = await toNextJson(api.GET('/store/products', { params: { query: { page: 1, pageSize: 20 } } }));
  return NextResponse.json(body, { status });
}