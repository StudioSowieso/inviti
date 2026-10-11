import Link from "next/link";
import { CheckIcon, Sparkle } from "@/components/icons";
import { PhoneFrame } from "@/components/landing/phone";
import { Logo } from "@/components/logo";

const POINTS = ["Een uitnodiging die voelt als jullie", "Gastenlijst en groepen op één plek", "Alle RSVP's in één overzicht"];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Beeldvlak: mobiel bovenaan, desktop links, in dezelfde stijl als de landingspagina */}
      <aside className="relative overflow-hidden bg-forest text-paper lg:min-h-dvh">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #fff 0, transparent 40%), radial-gradient(circle at 90% 90%, #fff 0, transparent 35%)",
          }}
        />
        <div className="relative flex h-44 items-end justify-between px-6 pb-6 sm:h-52 lg:h-full lg:flex-col lg:items-start lg:justify-between lg:p-14">
          <Link href="/" aria-label="Inviti, terug naar de startpagina" className="block">
            <Logo className="w-32 lg:w-56" tagline />
          </Link>

          <div className="relative z-10 hidden lg:block">
            <p className="eyebrow flex items-center gap-2 text-blush/80">
              Wedding planner <Sparkle width={9} height={9} />
            </p>
            <h2 className="mt-5 max-w-md font-serif text-6xl leading-[1.02] font-medium">
              Jullie dag,
              <br />
              <span className="italic text-blush">mooi geregeld.</span>
            </h2>
            <ul className="mt-8 space-y-3 text-sm text-paper/80">
              {POINTS.map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-paper/12 text-blush">
                    <CheckIcon width={13} height={13} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Echte uitnodiging in een telefoon, half uit beeld */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 -bottom-16 w-28 rotate-[7deg] sm:w-32 lg:right-10 lg:-bottom-24 lg:w-60"
          >
            <PhoneFrame slugs={["leaf"]} className="w-full" />
          </div>

          <p className="eyebrow hidden text-paper/50 lg:block">Een nieuw hoofdstuk begint met één beslissing</p>
        </div>
      </aside>

      <main className="flex items-start justify-center bg-cream px-6 pt-10 pb-12 lg:items-center lg:px-14">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
