import { getJson } from '@/src/lib/pageData';
import { EmptyState, ErrorAlert } from '@/src/components/States';

export default async function CartPage(){
  const r = await getJson<any>('/api/store/cart');
  if (!r.ok) return (<div className="mt-4"><ErrorAlert message={`加载失败 (${r.status})`} /></div>);
  const cart = (r.data as any)?.data || { items: [] };
  const items = cart.items || [];
  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">购物车</h1>
      {items.length === 0 ? (
        <EmptyState title="购物车为空" />
      ) : (
        <div className="space-y-3">
          {items.map((ci: any) => (
            <div key={ci.itemId} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{ci.product?.name}</div>
                <div className="text-slate-500 text-sm">数量：{ci.quantity}</div>
              </div>
              <form action={`/api/store/cart/${ci.itemId}`} method="post">
                <input type="hidden" name="_method" value="DELETE" />
                <button className="btn" type="submit">移除</button>
              </form>
            </div>
          ))}
        </div>
      )}
      <form action="/api/store/purchase" method="post" className="mt-4">
        <button className="btn" type="submit">结算</button>
      </form>
    </div>
  );
}