import { NextRequest, NextResponse } from 'next/server';
import { api, toNextJson } from '@/src/lib/client';
export async function GET(_: NextRequest, { params }: { params: { agentId: string } }){
  const { body, status } = await toNextJson(api.GET('/agents/{agentId}', { params: { path: { agentId: params.agentId } } }));
  return NextResponse.json(body, { status });
}