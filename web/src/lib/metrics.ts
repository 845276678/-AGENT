export function record(event: string, props?: any){
  try {
    if (typeof window === 'undefined') return;
    const payload = JSON.stringify({ event, props, ts: Date.now(), href: location.href });
    navigator.sendBeacon('/api/metrics', new Blob([payload], { type: 'application/json' }));
  } catch {}
}