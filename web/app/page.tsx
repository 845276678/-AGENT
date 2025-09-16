export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">AI Agent 市场（MVP）</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a className="card block no-underline" href="/agents">
          <div className="font-medium">Agents</div>
          <div className="text-sm text-slate-500">浏览与查看 Agent 详情</div>
        </a>
        <a className="card block no-underline" href="/ideas">
          <div className="font-medium">创意</div>
          <div className="text-sm text-slate-500">查看社区创意，提交你的点子</div>
        </a>
        <a className="card block no-underline" href="/store">
          <div className="font-medium">商店</div>
          <div className="text-sm text-slate-500">挑选商品，加入购物车、结算</div>
        </a>
      </div>
    </div>
  );
}