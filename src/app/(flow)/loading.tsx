export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Laden">
      <div className="h-16 border-b border-line bg-line/40" />
      <div className="mx-auto w-full max-w-[90rem] space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-10 w-72 rounded-xl bg-line" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="h-72 rounded-2xl bg-line/60" />
          <div className="h-72 rounded-2xl bg-line/60" />
          <div className="h-72 rounded-2xl bg-line/60" />
        </div>
      </div>
    </div>
  );
}
