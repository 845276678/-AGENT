import Breadcrumbs from '@/src/components/Breadcrumbs';
import ProfileEditor from '@/src/components/ProfileEditor';

async function fetchProfile(){
  const res = await fetch('/api/users/profile', { cache: 'no-store' });
  return res.json();
}

export default async function MePage(){
  const json = await fetchProfile();
  const profile = json?.data?.profile || {};
  return (
    <div>
      <Breadcrumbs />
      <h1 className="text-xl font-semibold mb-3">个人中心</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">用户名：{profile.username || '未设置'}</div>
        <div className="card"><a href="/me/wallet">我的钱包</a></div>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">编辑资料</h2>
        <ProfileEditor />
      </div>
    </div>
  );
}