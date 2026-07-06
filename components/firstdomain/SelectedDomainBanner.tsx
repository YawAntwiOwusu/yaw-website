"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSelectedDomain } from "@/lib/firstdomain/application-draft";

export function SelectedDomainBanner() {
  const [domain, setDomain] = useState<string | null>(null);

  useEffect(() => {
    setDomain(getSelectedDomain()?.domain ?? null);
  }, []);

  if (!domain) return null;

  return (
    <p className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
      Selected domain:{" "}
      <strong className="font-mono">{domain}</strong>
      {" · "}
      <Link
        href="/firstdomain#search"
        className="underline underline-offset-2 hover:text-indigo-700"
      >
        Change domain
      </Link>
    </p>
  );
}
