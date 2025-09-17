"use client";
import { useState } from 'react';
import Card from '@/src/components/Card';
import Button from '@/src/components/Button';

type Result = { ok: boolean; status?: number; ms?: number; error?: string; detail?: string };
const checks = [
  { key: 'agents', url: '/api/agents' },
  { key: 'ideas', url: '/api/ideas' },
  { key: 'products', url: '/api/store/products' },
  { key: 'profile', url: '/api/users/profile' },
  { key: 'wallet', url: '/api/users/wallet' },
] as const;

export default function HealthPage(){
  const [results, setResults] = useState<Record<string, Result>>({});
  const [running, setRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [metrics, setMetrics] = useState<{ counts: Record<string, number>; items: any[] } | null>(null);

  async function runBasic(){
    setRunning(true);
    const out: Record<string, Result> = {};
    for (const c of checks) {
      const t0 = Date.now();
      try {
        const res = await fetch(c.url, { cache: 'no-store' });
        out[c.key] = { ok: res.ok, status: (res as any).status, ms: Date.now() - t0 };
      } catch (e: any) {
        out[c.key] = { ok: false, error: e?.message, ms: Date.now() - t0 };
      }
    }
    setResults(prev => ({ ...prev, ...out }));
    setRunning(false);
  }

  async function checkProtected(){
    const t0 = Date.now();
    try {
      const res = await fetch('/me', { cache: 'no-store' });
      const redirected = (res.redirected || (!!res.url && new URL(res.url, location.origin).pathname.startsWith('/login')));
      setResults(prev => ({ ...prev, protected: { ok: !!redirected, status: (res as any).status, ms: Date.now() - t0, detail: redirected ? '未登录时跳转登录页' : '未跳转，可能已登录' } }));
    } catch (e: any) {
      setResults(prev => ({ ...prev, protected: { ok: false, error: e?.message, ms: Date.now() - t0 } }));
    }
  }

  async function doLogin(){
    const t0 = Date.now();
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'demo@example.com', password: '123456' }) });
      const ok = res.ok;
      const r2 = await fetch('/me', { cache: 'no-store' });
      const good = ok && !r2.redirected && new URL(r2.url, location.origin).pathname === '/me';
      setResults(prev => ({ ...prev, login: { ok: good, status: (r2 as any).status, ms: Date.now() - t0, detail: good ? '已登录' : '登录失败' } }));
    } catch (e: any) {
      setResults(prev => ({ ...prev, login: { ok: false, error: e?.message, ms: Date.now() - t0 } }));
    }
  }

  async function doLogout(){
    const t0 = Date.now();
    try {
      await fetch('/api/auth/logout');
      const r2 = await fetch('/me', { cache: 'no-store' });
      const redirected = (r2.redirected || (!!r2.url && new URL(r2.url, location.origin).pathname.startsWith('/login')));
      setResults(prev => ({ ...prev, logout: { ok: !!redirected, status: (r2 as any).status, ms: Date.now() - t0, detail: redirected ? '已登出' : '仍为登录态' } }));
    } catch (e: any) {
      setResults(prev => ({ ...prev, logout: { ok: false, error: e?.message, ms: Date.now() - t0 } }));
    }
  }

  async function downloadReport(){
    try {
      const blob = new Blob([JSON.stringify({ ts: Date.now(), results, metrics }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `health-report-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {}
  }

  async function runAll(){
    await runBasic();
    await checkProtected();
    await doLogin();
    await runBasic();
    await doLogout();
    await checkProtected();
  }

  async function loadMetrics(){ try { const r = await fetch('/api/metrics', { cache: 'no-store' }); const j = await r.json(); setMetrics(j?.data || null); } catch {} }
  async function clearMetrics(){ try { await fetch('/api/metrics', { method: 'DELETE' }); setMetrics(null); } catch {} }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">健康自测</h1>
      <Card className="space-y-3">
        <div className="text-sm text-slate-500">点击下方按钮，逐项检查前端 API 代理是否可用</div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={runBasic} disabled={running}>{running ? '检测中...' : '执行基础检测'}</Button>
          <Button variant="ghost" onClick={checkProtected}>受保护路径</Button>
          <Button variant="ghost" onClick={doLogin}>模拟登录</Button>
          <Button variant="ghost" onClick={doLogout}>登出并验证</Button>
          <Button variant="ghost" onClick={downloadReport}>下载报告(JSON)</Button>
          <Button variant="ghost" onClick={() => setShowDetails(v => !v)}>{showDetails ? '隐藏详情' : '显示详情'}</Button>
          <Button variant="ghost" onClick={runAll}>一键全链路</Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="text-sm text-slate-500">Metrics 概览（最近事件统计）</div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={loadMetrics}>刷新指标</Button>
          <Button variant="ghost" onClick={clearMetrics}>清空指标</Button>
        </div>
        {metrics ? (
          <div>
            <div className="text-sm">req:ok = {metrics.counts?.['req:ok'] || 0}，req:error = {metrics.counts?.['req:error'] || 0}</div>
            <div className="text-xs text-slate-500">最近事件：</div>
            <div className="text-xs space-y-1 mt-1">
              {(metrics.items || []).slice(0,8).map((it: any) => (
                <div key={it.id || it.ts} className="flex items-center gap-2">
                  <span className="w-20">{new Date(it.ts).toLocaleTimeString()}</span>
                  <span className="w-20">{it.event}</span>
                  <span className="flex-1 truncate">{it.props?.url || it.href || it.route || ''}</span>
                  <span className="w-16 text-right">{it.props?.status || ''}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500">暂无指标数据，点击“刷新指标”</div>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        {Object.entries(results).map(([key, r]) => {
          const color = r ? (r.ok ? 'text-green-600' : 'text-red-600') : 'text-slate-500';
          return (
            <Card key={key}>
              <div className="font-medium">{key}</div>
              <div className={`text-sm ${color}`}>
                {r ? (r.ok ? 'OK' : '失败') : '未检测'}
                {r?.status != null && <> · HTTP {r.status}</>}
                {r?.ms != null && <> · {r.ms}ms</>}
              </div>
              {r?.detail && <div className="text-xs text-slate-500 mt-1">{r.detail}</div>}
              {r?.error && <div className="text-xs text-slate-500 mt-1">{r.error}</div>}
              {showDetails && (
                <div className="mt-2">
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(r, null, 2)}</pre>
                  <button className="underline text-xs" onClick={() => navigator.clipboard.writeText(JSON.stringify(r))}>复制</button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}