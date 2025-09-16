'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }){
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
  const cls = active ? 'text-primary-600 font-medium' : '';
  return <Link className={cls} href={href}>{children}</Link>;
}