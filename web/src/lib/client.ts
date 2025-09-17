import type { paths } from '@/src/types';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/v1';

function buildUrl(path: string, params?: any){
  // replace {param} in path
  let p = path.replace(/\{(\w+)\}/g, (_, k) => params?.path?.[k] ?? '');
  const q = params?.query || params?.params?.query;
  const u = new URL(p.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : baseUrl + '/');
  if (q) Object.entries(q).forEach(([k, v]) => v != null && u.searchParams.set(k, String(v)));
  return u.toString();
}

function delay(ms: number){ return new Promise(res => setTimeout(res, ms)); }

// Fetch wrapper with timeout + simple retry, returns { data, error, response }
async function request<T>(method: string, path: keyof paths & string, opts: { headers?: Record<string,string>; body?: any; params?: any; timeoutMs?: number; retry?: number } = {}){
  const url = buildUrl(path, opts.params);
  const timeoutMs = opts.timeoutMs ?? 10000;
  const retry = Math.max(0, opts.retry ?? 1);
  let attempt = 0;
  while (attempt <= retry) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method, headers: opts.headers, body: typeof opts.body === 'object' ? JSON.stringify(opts.body) : opts.body, signal: controller.signal });
      clearTimeout(id);
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (!res.ok && attempt < retry && res.status >= 500) { attempt++; await delay(200 * attempt); continue; }
      return { data, response: res } as { data?: T; response: Response };
    } catch (error) {
      clearTimeout(id);
      if (attempt < retry) { attempt++; await delay(200 * attempt); continue; }
      return { error, response: new Response(null, { status: 500 }) } as any;
    }
  }
  return { error: new Error('request failed after retries'), response: new Response(null, { status: 500 }) } as any;
}

export const api = {
  GET: <T = unknown>(path: keyof paths & string, opts?: any) => request<T>('GET', path, opts),
  POST: <T = unknown>(path: keyof paths & string, opts?: any) => request<T>('POST', path, opts),
  PUT: <T = unknown>(path: keyof paths & string, opts?: any) => request<T>('PUT', path, opts),
  DELETE: <T = unknown>(path: keyof paths & string, opts?: any) => request<T>('DELETE', path, opts),
};

export async function toNextJson<T>(p: Promise<{ data?: T; error?: any; response: Response }>) {
  const { data, error, response } = await p;
  return { body: data ?? { error }, status: response.status };
}