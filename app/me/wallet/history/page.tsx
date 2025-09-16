import Breadcrumbs from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/States';

export default function WalletHistory(){
  // Stub: 后端暂无交易明细接口，先展示空态
  return (
    <div>
      <Breadcrumbs />
      <h1 className="text-xl font-semibold mb-3">钱包明细</h1>
      <EmptyState title="暂无交易" description="功能即将上线" />
    </div>
  );
}