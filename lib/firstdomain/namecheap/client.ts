const NAMECHEAP_API_URL = "https://api.namecheap.com/xml.response";
const NAMECHEAP_SANDBOX_URL = "https://api.sandbox.namecheap.com/xml.response";

export const SUPPORTED_TLDS = [".com", ".dev", ".app", ".io", ".co", ".net", ".org"];

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  price?: string;
  premium?: boolean;
}

function getConfig() {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  const clientIp = process.env.NAMECHEAP_CLIENT_IP;
  const sandbox = process.env.NAMECHEAP_SANDBOX === "true";

  if (!apiUser || !apiKey || !clientIp) {
    return null;
  }

  return {
    apiUser,
    apiKey,
    clientIp,
    baseUrl: sandbox ? NAMECHEAP_SANDBOX_URL : NAMECHEAP_API_URL,
  };
}

function slugifyProjectName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "")
    .replace(/^-+|-+$/g, "");
}

export function generateDomainCandidates(projectName: string): string[] {
  const slug = slugifyProjectName(projectName);
  if (!slug) return [];
  return SUPPORTED_TLDS.map((tld) => `${slug}${tld}`);
}

function parseDomainCheckResponse(xml: string): DomainCheckResult[] {
  const results: DomainCheckResult[] = [];
  const tagRegex = /<DomainCheckResult\b([^>]*)\/?>/g;

  let match;
  while ((match = tagRegex.exec(xml)) !== null) {
    const attrs = match[1];
    const attr = (name: string) =>
      attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1];

    const domain = attr("Domain");
    if (!domain) continue;

    results.push({
      domain,
      available: attr("Available") === "true",
      price: attr("PremiumRegistrationPrice") || undefined,
      premium: attr("IsPremiumName") === "true",
    });
  }

  return results;
}

/**
 * Availability via DNS-over-HTTPS: NXDOMAIN strongly suggests the domain is
 * unregistered. Registered-but-undelegated domains are rare, and anything
 * ambiguous is reported as taken so we never show a taken domain as available.
 */
async function checkViaDns(domain: string): Promise<boolean> {
  const response = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`,
    { headers: { Accept: "application/dns-json" } }
  );
  if (!response.ok) return false;
  const data = (await response.json()) as { Status: number };
  return data.Status === 3; // NXDOMAIN
}

/**
 * Fallback availability check via RDAP (public registry data, no API key).
 * rdap.org redirects to the registry's RDAP server; a 404 from the registry
 * means the domain is unregistered. If the TLD has no RDAP server (rdap.org
 * itself 404s without redirecting, e.g. .io/.co), fall back to a DNS check.
 */
async function checkViaRdap(domains: string[]): Promise<DomainCheckResult[]> {
  return Promise.all(
    domains.map(async (domain): Promise<DomainCheckResult> => {
      try {
        const redirect = await fetch(
          `https://rdap.org/domain/${encodeURIComponent(domain)}`,
          { headers: { Accept: "application/rdap+json" }, redirect: "manual" }
        );

        const location = redirect.headers.get("location");
        if (redirect.status >= 300 && redirect.status < 400 && location) {
          const registry = await fetch(location, {
            headers: { Accept: "application/rdap+json" },
          });
          if (registry.status === 404) return { domain, available: true };
          if (registry.ok) return { domain, available: false };
          // Registry errored; fall through to DNS.
        }

        return { domain, available: await checkViaDns(domain) };
      } catch {
        return { domain, available: false };
      }
    })
  );
}

export async function checkDomainAvailability(
  domains: string[]
): Promise<DomainCheckResult[]> {
  const config = getConfig();

  if (!config) {
    return checkViaRdap(domains);
  }

  const domainList = domains.join(",");
  const params = new URLSearchParams({
    ApiUser: config.apiUser,
    ApiKey: config.apiKey,
    UserName: config.apiUser,
    ClientIp: config.clientIp,
    Command: "namecheap.domains.check",
    DomainList: domainList,
  });

  const response = await fetch(`${config.baseUrl}?${params.toString()}`);
  const xml = await response.text();

  if (xml.includes('Status="ERROR"')) {
    const errorMatch = xml.match(/<Error Number="[^"]*">([^<]*)<\/Error>/);
    throw new Error(errorMatch?.[1] || "Namecheap API error");
  }

  return parseDomainCheckResponse(xml);
}

export interface DomainRegistrationResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export async function registerDomain(
  domain: string,
  years = 1
): Promise<DomainRegistrationResult> {
  const config = getConfig();

  if (!config) {
    return {
      success: false,
      error: "Namecheap API not configured",
    };
  }

  const [sld, ...tldParts] = domain.split(".");
  const tld = tldParts.join(".");

  const params = new URLSearchParams({
    ApiUser: config.apiUser,
    ApiKey: config.apiKey,
    UserName: config.apiUser,
    ClientIp: config.clientIp,
    Command: "namecheap.domains.create",
    DomainName: domain,
    Years: String(years),
    AuxBillingFirstName: "First",
    AuxBillingLastName: "Domain",
    AuxBillingAddress1: "NA",
    AuxBillingCity: "NA",
    AuxBillingStateProvince: "NA",
    AuxBillingPostalCode: "00000",
    AuxBillingCountry: "US",
    AuxBillingPhone: "+1.5555555555",
    AuxBillingEmailAddress: process.env.FIRSTDOMAIN_FROM_EMAIL || "admin@example.com",
    TechFirstName: "First",
    TechLastName: "Domain",
    TechAddress1: "NA",
    TechCity: "NA",
    TechStateProvince: "NA",
    TechPostalCode: "00000",
    TechCountry: "US",
    TechPhone: "+1.5555555555",
    TechEmailAddress: process.env.FIRSTDOMAIN_FROM_EMAIL || "admin@example.com",
    AdminFirstName: "First",
    AdminLastName: "Domain",
    AdminAddress1: "NA",
    AdminCity: "NA",
    AdminStateProvince: "NA",
    AdminPostalCode: "00000",
    AdminCountry: "US",
    AdminPhone: "+1.5555555555",
    AdminEmailAddress: process.env.FIRSTDOMAIN_FROM_EMAIL || "admin@example.com",
    RegistrantFirstName: "First",
    RegistrantLastName: "Domain",
    RegistrantAddress1: "NA",
    RegistrantCity: "NA",
    RegistrantStateProvince: "NA",
    RegistrantPostalCode: "00000",
    RegistrantCountry: "US",
    RegistrantPhone: "+1.5555555555",
    RegistrantEmailAddress: process.env.FIRSTDOMAIN_FROM_EMAIL || "admin@example.com",
  });

  const response = await fetch(`${config.baseUrl}?${params.toString()}`);
  const xml = await response.text();

  if (xml.includes('Status="ERROR"')) {
    const errorMatch = xml.match(/<Error Number="[^"]*">([^<]*)<\/Error>/);
    return {
      success: false,
      error: errorMatch?.[1] || "Domain registration failed",
    };
  }

  const orderMatch = xml.match(/OrderID="(\d+)"/);
  return {
    success: true,
    orderId: orderMatch?.[1],
  };
}

export { slugifyProjectName };
