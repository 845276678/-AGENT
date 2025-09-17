"use client";
import { useEffect, useState } from 'react';
import { Input, Textarea } from '@/src/components/Inputs';
import Button from '@/src/components/Button';
import Spinner from '@/src/components/Spinner';
import { ErrorAlert } from '@/src/components/States';
import { required, minLength } from '@/src/lib/validate';

export default function ProfileEditor(){
  const [profile, setProfile] = useState<any>({ username: '', bio: '', location: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const j = await fetch('/api/users/profile').then(r => r.json()).catch(() => ({}));
        setProfile({ username: j?.data?.profile?.username || '', bio: j?.data?.profile?.bio || '', location: j?.data?.profile?.location || '' });
      } catch {}
    })();
  }, []);

  function validate(){
    const e1 = required(profile.username, '请输入用户名');
    if (e1) return e1;
    const e2 = minLength(profile.username, 2, '用户名至少 2 个字符');
    if (e2) return e2;
    return null;
  }

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setErr(null);
    const v = validate(); if (v) { setErr(v); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
      if (res.ok) setMsg('保存成功'); else setErr('保存失败');
    } catch { setErr('网络错误'); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
      {err && <ErrorAlert message={err} />}
      <div>
        <div className="text-sm text-slate-500">用户名</div>
        <Input value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })} />
      </div>
      <div>
        <div className="text-sm text-slate-500">所在地</div>
        <Input value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
      </div>
      <div>
        <div className="text-sm text-slate-500">个人简介</div>
        <Textarea rows={4} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
      </div>
      <Button disabled={saving || !!validate()}>
        {saving ? (<span className="inline-flex items-center gap-1"><Spinner size={14} /> 保存中...</span>) : '保存'}
      </Button>
      {msg && <div className="text-sm text-green-600">{msg}</div>}
    </form>
  );
}