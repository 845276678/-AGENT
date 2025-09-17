import { getJson } from '@/src/lib/pageData';
import { EmptyState, ErrorAlert } from '@/src/components/States';

export default async function StorePage(){
  const r = await getJson<any>('/api/store/products');
  if (!r.ok) return (<div className="mt-4"><ErrorAlert message={`加载失败 (${r.status})`} /></div>);
  const items = (r.data as any)?.data?.items || [];
  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">商品列表</h1>
      {items.length === 0 ? (
        <EmptyState title="暂无商品" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p: any) => (
            <div key={p.id} className="card">
              <div className="font-medium">{p.name}</div>
              <div className="text-slate-500">{p.price} {p.currency}</div>
              <form action="/api/store/cart" method="post">
                <input type="hidden" name="productId" value={p.id} />
                <button className="btn mt-2" type="submit">加入购物车</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}