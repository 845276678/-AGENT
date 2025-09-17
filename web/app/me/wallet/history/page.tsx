import Breadcrumbs from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/States';

async function fetchHistory(){
  const res = await fetch('/api/users/wallet/history', { cache: 'no-store' });
  return res.json().catch(() => ({}));
}

export default async function WalletHistory(){
  const j = await fetchHistory();
  const items = j?.data?.items || [];
  return (
    <div>
      <Breadcrumbs />
      <h1 className="text-xl font-semibold mb-3">钱包明细</h1>
      {items.length === 0 ? (
        <EmptyState title="暂无交易" description="功能即将上线" />
      ) : (
        <div className="space-y-3">
          {items.map((it: any) => (
            <div key={it.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{it.type === 'deposit' ? '充值' : '提现'} {it.amount}</div>
                <div className="text-xs text-slate-500">{new Date(it.ts).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}