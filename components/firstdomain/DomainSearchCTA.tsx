"use client";

import { useRouter } from "next/navigation";
import { DomainChecker } from "@/components/firstdomain/DomainChecker";
import { setSelectedDomain } from "@/lib/firstdomain/application-draft";

interface DomainSearchCTAProps {
  id?: string;
  variant?: "light" | "dark";
  inputId?: string;
}

export function DomainSearchCTA({
  id = "search",
  variant = "light",
  inputId,
}: DomainSearchCTAProps) {
  const router = useRouter();

  function handleSelectDomain(domain: string, price?: string) {
    setSelectedDomain(domain, price);
    router.push("/firstdomain/apply");
  }

  return (
    <div id={id} className="mx-auto w-full max-w-lg scroll-mt-24 text-left">
      <DomainChecker
        compact
        variant={variant}
        inputId={inputId ?? (variant === "dark" ? "applyCtaProjectName" : "heroProjectName")}
        onSelectDomain={handleSelectDomain}
        selectLabel="Continue with this domain"
      />
    </div>
  );
}
