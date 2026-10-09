"use client";

import { useEffect, useMemo, useState } from "react";
import { targetTimestamp } from "@/lib/invitation/format";

/** Aftelwaarden [waarde, label] voor dagen, uren, minuten en seconden; "--" tot de klok bekend is. */
export function useCountdown(date: string, time: string): [string, string][] {
  const target = useMemo(() => targetTimestamp(date, time), [date, time]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (target === null || now === null) {
    return [
      ["--", "Dagen"],
      ["--", "Uren"],
      ["--", "Minuten"],
      ["--", "Seconden"],
    ];
  }
  const s = Math.floor(Math.max(0, target - now) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    [String(Math.floor(s / 86400)), "Dagen"],
    [pad(Math.floor((s % 86400) / 3600)), "Uren"],
    [pad(Math.floor((s % 3600) / 60)), "Minuten"],
    [pad(s % 60), "Seconden"],
  ];
}
