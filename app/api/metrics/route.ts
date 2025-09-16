import { NextRequest, NextResponse } from 'next/server';
// Accepts JSON metrics and drops them; extend to forward to server if needed.
export async function POST(req: NextRequest){
  // Optionally log a sample in dev
  try {
    const body = await req.json();
    // eslint-disable-next-line no-console
    console.log('[metrics]', body?.event || 'event', body?.props || {});
  } catch {}
  return new NextResponse(null, { status: 204 });
}