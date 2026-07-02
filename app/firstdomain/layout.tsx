import type { Metadata } from "next";
import { FirstDomainHeader } from "@/components/firstdomain/FirstDomainHeader";
import { FirstDomainFooter } from "@/components/firstdomain/FirstDomainFooter";

export const metadata: Metadata = {
  title: {
    default: "First Domain — Founder Discovery Platform",
    template: "%s | First Domain",
  },
  description:
    "First Domain helps founders identify, support, and showcase the next generation of builders — starting with a domain for your startup.",
  openGraph: {
    title: "First Domain — Founder Discovery Platform",
    description:
      "Apply for your first domain. A monthly program supporting founders from application to launch.",
    siteName: "First Domain",
  },
};

export default function FirstDomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <FirstDomainHeader />
      <main className="flex-1">{children}</main>
      <FirstDomainFooter />
    </div>
  );
}
