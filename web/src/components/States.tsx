export function EmptyState({ title = '暂无数据', description }: { title?: string; description?: string }){
  return (
    <div className="text-center text-slate-500 py-10">
      <div className="text-sm font-medium">{title}</div>
      {description && <div className="text-xs mt-1">{description}</div>}
    </div>
  );
}
export function ErrorAlert({ message = '出错了', onRetry }: { message?: string; onRetry?: () => void }){
  return (
    <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center justify-between">
      <div>{message}</div>
      {onRetry && <button className="underline" onClick={onRetry}>重试</button>}
    </div>
  );
}