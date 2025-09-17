"use client";
import { useState } from 'react';
import Card from '@/src/components/Card';
import Button from '@/src/components/Button';

const checks = [
  { key: 'agents', url: '/api/agents' },
  { key: 'ideas', url: '/api/ideas' },
  { key: 'products', url: '/api/store/products' },
  { key: 'profile', url: '/api/users/profile' },
  { key: 'wallet', url: '/api/users/wallet' },
];

export default function HealthPage(){
  const [results, setResults] = useState<Record<string, { ok: boolean; status?: number; ms?: number; error?: string }>>({});
  const [running, setRunning] = useState(false);
  async function run(){
    setRunning(true);
    const out: typeof results = {};
    for (const c of checks) {
      const t0 = Date.now();
      try {
        const res = await fetch(c.url, { cache: 'no-store' });
        out[c.key] = { ok: res.ok, status: res.status, ms: Date.now() - t0 };
      } catch (e: any) {
        out[c.key] = { ok: false, error: e?.message, ms: Date.now() - t0 };
      }
    }
    setResults(out);
    setRunning(false);
  }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">健康自测</h1>
      <Card className="space-y-3">
        <div className="text-sm text-slate-500">点击下方按钮，逐项检查前端 API 代理是否可用</div>
        <Button onClick={run} disabled={running}>{running ? '检测中...' : '执行检测'}</Button>
      </Card>
      <div className="grid sm:grid-cols-2 gap-3">
        {checks.map(c => {
          const r = results[c.key];
          const color = r ? (r.ok ? 'text-green-600' : 'text-red-600') : 'text-slate-500';
          return (
            <Card key={c.key}>
              <div className="font-medium">{c.key}</div>
              <div className={`text-sm ${color}`}>
                {r ? (r.ok ? 'OK' : '失败') : '未检测'}
                {r?.status != null && <> · HTTP {r.status}</>}
                {r?.ms != null && <> · {r.ms}ms</>}
              </div>
              {r?.error && <div className="text-xs text-slate-500 mt-1">{r.error}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}