import ClientHeader from "@/components/ui/client-header";

// クリック直後に即表示されるスケルトン（ニュース一覧）。
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
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-neutral-200 p-4">
              <div className="h-24 w-32 flex-shrink-0 animate-pulse rounded-lg bg-neutral-100" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
