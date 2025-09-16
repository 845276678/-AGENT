async function fetchCart(){
  const res = await fetch('/api/store/cart', { cache: 'no-store' });
  return res.json();
}
export default async function CartPage(){
  const json = await fetchCart();
  const cart = json?.data || { items: [] };
  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">购物车</h1>
      <div className="space-y-3">
        {(cart.items || []).map((ci: any) => (
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
      <form action="/api/store/purchase" method="post" className="mt-4">
        <button className="btn" type="submit">结算</button>
      </form>
    </div>
  );
}