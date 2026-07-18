"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId() {
  try {
    const key = "fwd_analytics_sid";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
    return id;
  } catch {
    return null;
  }
}

export function PageviewBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/fwd") || pathname.startsWith("/api")) {
      return;
    }

    const sessionId = getSessionId();
    const payload = {
      path: pathname,
      referrer: document.referrer || null,
      sessionId,
    };

    void fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // ignore beacon failures
    });
  }, [pathname]);

  return null;
}
