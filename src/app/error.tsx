"use client";

import { useEffect } from "react";
import { logClientError } from "@/lib/log-error-client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logClientError("render", error.message || "Onbekende fout", { digest: error.digest });
  }, [error]);

  return (
    <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 text-center">
      <div>
        <h1 className="font-serif text-3xl font-medium">Er ging iets mis</h1>
        <p className="mt-3 text-sm text-muted">
          Sorry, dit is niet de bedoeling. We hebben de fout automatisch doorgegeven.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-forest px-6 py-3 text-sm text-white"
        >
          Opnieuw proberen
        </button>
      </div>
    </main>
  );
}
