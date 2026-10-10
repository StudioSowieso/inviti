import { Botanical } from "@/components/icons";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Beeldvlak — mobiel bovenaan, desktop links */}
      <aside className="relative overflow-hidden bg-forest text-paper lg:min-h-dvh">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, #fff 0, transparent 40%), radial-gradient(circle at 85% 90%, #fff 0, transparent 35%)",
          }}
        />
        <div className="relative flex h-56 items-end justify-between px-6 pb-6 sm:h-64 lg:h-full lg:flex-col lg:items-start lg:justify-between lg:p-14">
          <Logo className="w-32 lg:w-60" tagline />

          <div className="hidden lg:block">
            <p className="eyebrow text-blush/80">Wedding planner</p>
            <h2 className="mt-5 max-w-md font-serif text-6xl leading-[1.02] font-medium">
              Jullie dag,
              <br />
              mooi geregeld.
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/70">
              Uitnodigingen, gastenlijst en RSVP&apos;s op één rustige plek. Zodat jullie
              aandacht naar elkaar kan gaan.
            </p>
          </div>

          {/* Boogvenster met botanische illustratie */}
          <div className="absolute right-6 bottom-0 h-44 w-32 overflow-hidden rounded-t-full border border-paper/25 bg-forest-deep/40 sm:h-52 sm:w-36 lg:right-14 lg:bottom-14 lg:h-80 lg:w-56">
            <Botanical className="absolute inset-x-0 bottom-0 mx-auto h-[92%] text-blush/70" />
          </div>

          <p className="eyebrow hidden text-paper/50 lg:block">
            Een nieuw hoofdstuk begint met één beslissing
          </p>
        </div>
      </aside>

      <main className="flex items-start justify-center px-6 pt-10 pb-12 lg:items-center lg:px-14">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
