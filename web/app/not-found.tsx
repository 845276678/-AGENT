export default function NotFound(){
  return (
    <div className="container py-16 text-center">
      <div className="text-3xl font-semibold mb-2">404</div>
      <div className="text-slate-500 mb-6">页面不存在</div>
      <a className="btn" href="/">返回首页</a>
    </div>
  );
}