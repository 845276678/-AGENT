"use client";
import { useState } from 'react';
import { Input, Textarea } from '@/src/components/Inputs';
import Button from '@/src/components/Button';
import { required, minLength } from '@/src/lib/validate';

export default function NewIdeaPage(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setMsg('');
    if (!title.trim()) { setMsg('请输入标题'); return; }
    if (description.trim().length < 10) { setMsg('描述不少于 10 个字'); return; }
    setSubmitting(true);
    const res = await fetch('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description }) });
    setSubmitting(false);
    if (res.ok) { setMsg('提交成功，返回列表'); setTimeout(() => (window.location.href = '/ideas'), 500); }
    else { setMsg('提交失败'); }
  }
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-3">提交创意</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input placeholder="标题" value={title} onChange={e => setTitle(e.target.value)} />
        <Textarea placeholder="描述" rows={6} value={description} onChange={e => setDescription(e.target.value)} />
        <Button disabled={submitting}>{submitting ? '提交中...' : '提交'}</Button>
        {msg && <div className="text-sm text-slate-600">{msg}</div>}
      </form>
    </div>
  );
}