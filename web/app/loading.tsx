import Spinner from '@/src/components/Spinner';
export default function Loading(){
  return (
    <div className="container py-10 flex items-center gap-2 text-slate-500">
      <Spinner /> 正在加载...
    </div>
  );
}