import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import NotesSection from "@/components/NotesSection";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notes | Yaw Antwi Owusu",
  description:
    "Essays and notes on product, design, entrepreneurship, and culture in Ghana — by Yaw Antwi-Owusu.",
  keywords: [
    "notes",
    "Ghana",
    "entrepreneurship",
    "product",
    "design",
    "Yaw Antwi Owusu",
  ],
  openGraph: {
    title: "Notes | Yaw Antwi Owusu",
    description:
      "Essays and notes on product, design, entrepreneurship, and culture in Ghana.",
    url: `${SITE_URL}/notes`,
    siteName: "Yaw Antwi-Owusu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notes | Yaw Antwi Owusu",
    description:
      "Essays and notes on product, design, entrepreneurship, and culture in Ghana.",
  },
  alternates: {
    canonical: `${SITE_URL}/notes`,
  },
  robots: { index: true, follow: true },
};

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yawantwiowusu/" },
  { label: "Twitter", href: "https://twitter.com/yawantwiowusu" },
  { label: "Mail", href: "mailto:me@yawantwiowusu.com" },
];

export default function NotesPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <NotesSection />
      <Footer links={socialLinks} />
    </main>
  );
}
