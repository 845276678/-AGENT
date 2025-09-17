import { getJson } from '@/src/lib/pageData';
import { EmptyState, ErrorAlert } from '@/src/components/States';

export default async function IdeasPage(){
  const r = await getJson<any>('/api/ideas');
  if (!r.ok) return (<div className="mt-4"><ErrorAlert message={`加载失败 (${r.status})`} /></div>);
  const items = (r.data as any)?.data?.items || [];
  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">创意</h1>
      {items.length === 0 ? (
        <EmptyState title="暂无创意" />
      ) : (
        <div className="space-y-3">
          {items.map((it: any) => (
            <div key={it.id} className="card">
              <div className="font-medium">{it.title || it.id}</div>
              <div className="text-sm text-slate-600 line-clamp-2">{it.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}