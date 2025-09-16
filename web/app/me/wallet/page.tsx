"use client";
import { useEffect, useState } from 'react';
import { Input } from '@/src/components/Inputs';
import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import Spinner from '@/src/components/Spinner';
import { isPositiveNumber } from '@/src/lib/validate';

async function fetchWallet(){
  const res = await fetch('/api/users/wallet', { cache: 'no-store' });
  return res.json().catch(() => ({}));
}

export default function WalletPage(){
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [amount, setAmount] = useState('100');
  const [msg, setMsg] = useState('');

  async function reload(){
    setLoading(true);
    const j = await fetchWallet();
    setData(j?.data || j);
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);

  async function action(path: 'deposit'|'withdraw'){
    setMsg('');
    const err = isPositiveNumber(amount);
    if (err) { setMsg(err); return; }
    const res = await fetch(`/api/users/wallet/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Number(amount) }) });
    if (res.ok) { setMsg(path === 'deposit' ? '充值成功' : '提现成功'); reload(); } else { setMsg('操作失败'); }
  }

  const wallet = (data?.data?.wallet || data?.wallet) || { balance: 0, currency: 'CNY' };
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">我的钱包</h1>
      <Card>
        {loading ? <div className="flex items-center gap-2 text-slate-500"><Spinner /> 加载中...</div> : (
          <div className="text-slate-700 dark:text-slate-200">余额：<span className="font-medium">{wallet.balance}</span> {wallet.currency}</div>
        )}
      </Card>
      <Card className="space-y-3">
        <div className="text-sm text-slate-500">金额</div>
        <Input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={() => action('deposit')}>充值</Button>
          <Button variant="ghost" onClick={() => action('withdraw')}>提现</Button>
        </div>
        {msg && <div className="text-sm text-green-600">{msg}</div>}
      </Card>
    </div>
  );
}