// Direct zichtbaar zodra je ergens op klikt, terwijl de pagina zelf nog laadt.
export default function Loading() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-label="Laden">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-3 w-40 rounded-full bg-line" />
          <div className="h-9 w-64 rounded-xl bg-line" />
        </div>
        <div className="size-12 rounded-full bg-line" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="h-64 rounded-[1.5rem] bg-line/70" />
        <div className="h-64 rounded-[1.5rem] bg-line/50" />
      </div>
    </div>
  );
}
