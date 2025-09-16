import { NextResponse } from 'next/server';
import { api, toNextJson } from '@/src/lib/client';
export async function GET(){
  const { body, status } = await toNextJson(api.GET('/agents'));
  return NextResponse.json(body, { status });
}