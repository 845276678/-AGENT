import { EmptyState } from '@/src/components/States';

async function fetchIdeas(){
  const res = await fetch('/api/ideas', { cache: 'no-store' });
  return res.json();
}
export default async function IdeasPage(){
  const json = await fetchIdeas();
  const items = json?.data?.items || [];
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