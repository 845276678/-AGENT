'use client';
import { useEffect } from 'react';
function beacon(event: string, props?: any){
  try { navigator.sendBeacon('/api/metrics', JSON.stringify({ event, props, ts: Date.now(), href: location.href })); } catch {}
}
export default function Analytics(){
  useEffect(() => {
    beacon('pageview');
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const tag = t.tagName.toLowerCase();
      if (tag === 'a' || t.closest('a')) beacon('click', { tag: 'a' });
    };
    window.addEventListener('click', onClick, { capture: true });
    return () => window.removeEventListener('click', onClick, { capture: true } as any);
  }, []);
  return null;
}