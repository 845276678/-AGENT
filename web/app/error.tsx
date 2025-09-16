"use client";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }){
  return (
    <html lang="zh-CN"><body>
      <div className="container py-10">
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          出错了：{error.message}
        </div>
        <button className="btn mt-4" onClick={() => reset()}>重试</button>
      </div>
    </body></html>
  );
}