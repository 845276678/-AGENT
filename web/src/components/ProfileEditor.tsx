'use client';
import { useEffect, useState } from 'react';
import { Input, Textarea } from '@/src/components/Inputs';
import Button from '@/src/components/Button';

export default function ProfileEditor(){
  const [profile, setProfile] = useState<any>({ username: '', bio: '', location: '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { (async () => { const j = await fetch('/api/users/profile').then(r => r.json()).catch(() => ({})); setProfile({ username: j?.data?.profile?.username || '', bio: j?.data?.profile?.bio || '', location: j?.data?.profile?.location || '' }); })(); }, []);
  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setSaving(true);
    const res = await fetch('/api/users/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
    setSaving(false);
    if (res.ok) setMsg('保存成功'); else setMsg('保存失败');
  }
  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
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
      <Button disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
      {msg && <div className="text-sm text-green-600">{msg}</div>}
    </form>
  );
}