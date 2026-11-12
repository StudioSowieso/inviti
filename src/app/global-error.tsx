"use client";

import { useEffect } from "react";
import { logClientError } from "@/lib/log-error-client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logClientError("render-global", error.message || "Onbekende fout", { digest: error.digest });
  }, [error]);

  return (
    <html lang="nl">
      <body style={{ fontFamily: "sans-serif", textAlign: "center", padding: "4rem 1.5rem" }}>
        <h1>Er ging iets mis</h1>
        <p>We hebben de fout automatisch doorgegeven.</p>
        <button onClick={reset}>Opnieuw proberen</button>
      </body>
    </html>
  );
}
