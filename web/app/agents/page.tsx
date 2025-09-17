import { getJson } from '@/src/lib/pageData';
import { EmptyState, ErrorAlert } from '@/src/components/States';

export default async function AgentsPage(){
  const r = await getJson<any>('/api/agents');
  if (!r.ok) return (<div className="mt-4"><ErrorAlert message={`加载失败 (${r.status})`} /></div>);
  const items = (r.data as any)?.data?.items || [];
  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Agent 列表</h1>
      {items.length === 0 ? (
        <EmptyState title="暂无 Agent" description="即将上线更多 Agent" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((a: any) => (
            <a key={a.id} href={`/agents/${a.id}`} className="card block no-underline">
              <div className="text-base font-medium">{a.name || a.id}</div>
              <div className="text-sm text-slate-500 line-clamp-2">{a.description}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}