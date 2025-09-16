'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labels: Record<string, string> = { '/': '首页', '/agents': 'Agents', '/ideas': '创意', '/store': '商店', '/me': '个人中心' };

export default function Breadcrumbs(){
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const nodes = ['/', ...parts.map((_, i) => '/' + parts.slice(0, i+1).join('/'))];
  return (
    <nav className="text-sm text-slate-500 mb-3">
      {nodes.map((href, i) => (
        <span key={href}>
          {i > 0 && <span className="mx-1">/</span>}
          {i < nodes.length - 1 ? <Link href={href}>{labels[href] || href.split('/').slice(-1)[0]}</Link> : <span className="text-slate-700">{labels[href] || href.split('/').slice(-1)[0]}</span>}
        </span>
      ))}
    </nav>
  );
}