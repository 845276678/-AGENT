import { record } from '@/src/lib/metrics';

export type FetchResult<T = any> = { ok: boolean; status: number; data: T | null; error?: any };

function delay(ms: number) { return new Promise(res => setTimeout(res, ms)); }

export async function getJson<T = any>(
  url: string,
  init?: RequestInit & { throwOnError?: boolean; timeoutMs?: number; retry?: number }
): Promise<FetchResult<T>> {
  const timeoutMs = init?.timeoutMs ?? 10000;
  const retry = Math.max(0, init?.retry ?? 1);
  let attempt = 0;
  let lastErr: any = null;
  while (attempt <= retry) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const t0 = Date.now();
      const res = await fetch(url, { cache: 'no-store', ...init, signal: controller.signal });
      const dt = Date.now() - t0;
      if (typeof window !== 'undefined') record(res.ok ? 'req:ok' : 'req:error', { url, status: res.status, ms: dt, method: (init?.method||'GET') });
      clearTimeout(timer);
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (!res.ok) {
        if (attempt < retry && res.status >= 500) { attempt++; await delay(200 * attempt); continue; }
        if (init?.throwOnError) throw new Error(data?.error?.message || `HTTP ${res.status}`);
        return { ok: false, status: res.status, data, error: data?.error || { message: 'Request failed', ms: dt } } as any;
      }
      return { ok: true, status: res.status, data } as any;
    } catch (e: any) {
      clearTimeout(timer);
      lastErr = e;
      if (attempt < retry) { attempt++; await delay(200 * attempt); continue; }
      return { ok: false, status: 0, data: null, error: { message: e?.message || 'Network error' } };
    }
  }
  return { ok: false, status: 0, data: null, error: lastErr };
}