"use client";
import { useState } from 'react';
import { required, minLength } from '@/src/lib/validate';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [loading, setLoading] = useState(false);

  function validate(){
    const e = {
      email: required(email, '请输入邮箱'),
      password: minLength(password, 6, '密码至少 6 位')
    };
    setErrors(e);
    return !e.email && !e.password;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    if (!validate()) return;
    setLoading(true);
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setMsg('登录成功，稍后跳转');
      const rt = new URLSearchParams(window.location.search).get('returnTo') || '/'; setTimeout(() => (window.location.href = rt), 500);
    } else {
      setMsg(j?.error?.message || '登录失败');
    }
  }

  return (
    <div>
      <h1>登录</h1>
      <form onSubmit={onSubmit} className="space-y-2" style={{ maxWidth: 360 }}>
        <div>
          <input className="input w-full" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} />
          {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
        </div>
        <div>
          <input className="input w-full" placeholder="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? '登录中...' : '登录'}</button>
        {msg && <div className="text-sm text-slate-600">{msg}</div>}
      </form>
    </div>
  );
}