function genId(){
  try { return (crypto && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; } catch { return `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
}

export function record(event: string, props?: any){
  try {
    if (typeof window === 'undefined') return;
    const base = {
      id: genId(),
      ts: Date.now(),
      href: location.href,
      route: location.pathname,
      referrer: document.referrer || undefined,
    };
    const payload = JSON.stringify({ event, props, ...base });
    navigator.sendBeacon('/api/metrics', new Blob([payload], { type: 'application/json' }));
  } catch {}
}