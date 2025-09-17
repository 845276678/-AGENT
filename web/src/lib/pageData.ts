export type FetchResult<T = any> = { ok: boolean; status: number; data: T | null; error?: any };

export async function getJson<T = any>(url: string, init?: RequestInit & { throwOnError?: boolean }): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url, { cache: 'no-store', ...init });
    let data: any = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      if (init?.throwOnError) throw new Error(data?.error?.message || `HTTP ${res.status}`);
      return { ok: false, status: res.status, data, error: data?.error || { message: 'Request failed' } } as any;
    }
    return { ok: true, status: res.status, data } as any;
  } catch (e: any) {
    return { ok: false, status: 0, data: null, error: { message: e?.message || 'Network error' } };
  }
}