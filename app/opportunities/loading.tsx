import ClientHeader from "@/components/ui/client-header";

// クリック直後に即表示されるスケルトン。
// 本番ではISRキャッシュ+prefetchでほぼ瞬時に本体へ切り替わるが、
// 未キャッシュ時でも「押しても無反応」に見えないよう即座にシェルを描画する。
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 border-b border-neutral-200 pb-8 sm:mb-12">
          <div className="h-6 w-40 animate-pulse rounded-full bg-neutral-100" />
          <div className="mt-4 h-10 w-2/3 animate-pulse rounded-lg bg-neutral-100 sm:h-14" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-neutral-200">
              <div className="aspect-[16/10] w-full animate-pulse bg-neutral-100" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
                <div className="h-8 w-full animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
