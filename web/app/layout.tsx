import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'AI Agent 市场',
    template: '%s · AI Agent 市场'
  },
  description: '一个用于浏览 Agent、提交创意、购买商品并管理钱包余额的示例网站',
  applicationName: 'AI Agent 市场',
  openGraph: {
    title: 'AI Agent 市场',
    description: '浏览 Agent、提交创意、购买商品并管理钱包余额',
    type: 'website'
  },
  icons: {
    icon: '/icon.svg'
  }
};
import './globals.css';
import { cookies } from 'next/headers';
import Analytics from '@/src/components/Analytics';
import NavLink from '@/src/components/NavLink';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasToken = cookies().get('auth_token');
  return (
    <html lang="zh-CN">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, sans-serif', margin: 0 }}>
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <NavLink href="/">首页</NavLink>
            <NavLink href="/ideas">创意</NavLink>
            <NavLink href="/ideas/new">提交创意</NavLink>
            <NavLink href="/store">商店（占位）</NavLink>
            <span style={{ marginLeft: 'auto' }}>
              {hasToken ? (<>
                <NavLink href="/me">个人中心</NavLink>
                <a style={{ marginLeft: 12 }} href="/api/auth/logout">退出</a>
              </>) : (
                <NavLink href="/login">登录</NavLink>
              )}
            </span>
          </nav>
        </header>
        <main className="container">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}