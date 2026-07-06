const DOMAIN_KEY = "firstdomain:selectedDomain";
const PRICE_KEY = "firstdomain:estimatedPrice";

export type SelectedDomainDraft = {
  domain: string;
  estimatedPrice?: string;
};

export function getSelectedDomain(): SelectedDomainDraft | null {
  if (typeof window === "undefined") return null;

  const domain = sessionStorage.getItem(DOMAIN_KEY);
  if (!domain) return null;

  const estimatedPrice = sessionStorage.getItem(PRICE_KEY) ?? undefined;
  return { domain, estimatedPrice: estimatedPrice || undefined };
}

export function setSelectedDomain(domain: string, estimatedPrice?: string): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(DOMAIN_KEY, domain);
  if (estimatedPrice) {
    sessionStorage.setItem(PRICE_KEY, estimatedPrice);
  } else {
    sessionStorage.removeItem(PRICE_KEY);
  }
}

export function clearSelectedDomain(): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(DOMAIN_KEY);
  sessionStorage.removeItem(PRICE_KEY);
}

export async function verifyDomainAvailable(domain: string): Promise<boolean> {
  const projectName = domain.trim().split(".")[0];
  if (!projectName) return false;

  const response = await fetch("/api/firstdomain/domains/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectName: projectName.trim() }),
  });

  if (!response.ok) return false;

  const data = (await response.json()) as {
    results?: Array<{ domain: string; available: boolean }>;
  };

  return (
    data.results?.some(
      (result) => result.domain === domain.trim() && result.available
    ) ?? false
  );
}
