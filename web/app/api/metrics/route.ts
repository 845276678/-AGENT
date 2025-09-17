import { NextRequest, NextResponse } from 'next/server';

type Metric = { ts: number; event: string; props?: any };
const buf: Metric[] = [];
const MAX = 200;

export async function POST(req: NextRequest){
  try {
    const body = await req.json();
    const m: Metric = { ts: Date.now(), event: String(body?.event || 'event'), props: body?.props };
    buf.push(m);
    if (buf.length > MAX) buf.splice(0, buf.length - MAX);
    // eslint-disable-next-line no-console
    console.log('[metrics]', m.event, m.props || {});
  } catch {}
  return new NextResponse(null, { status: 204 });
}

export async function GET(){
  const counts: Record<string, number> = {};
  for (const m of buf) counts[m.event] = (counts[m.event] || 0) + 1;
  return NextResponse.json({ success: true, data: { counts, items: buf.slice().reverse() } });
}

export async function DELETE(){
  buf.length = 0;
  return new NextResponse(null, { status: 204 });
}