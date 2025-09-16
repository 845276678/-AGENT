async function fetchAgent(id: string){
  const res = await fetch(`/api/agents/${id}`, { cache: 'no-store' });
  return res.json();
}
export default async function AgentDetail({ params }: { params: { agentId: string } }){
  const data = await fetchAgent(params.agentId);
  const agent = data?.data || data;
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">{agent?.name || params.agentId}</h1>
      <pre className="card whitespace-pre-wrap">{JSON.stringify(agent, null, 2)}</pre>
    </div>
  );
}
