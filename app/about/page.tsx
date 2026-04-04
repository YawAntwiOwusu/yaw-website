import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const ABOUT_DESCRIPTION =
  "Product operator, designer, and entrepreneur building and scaling products at the intersection of technology, business, and growth in emerging markets.";

const ABOUT_IMAGE_PATH = "/images/yaw%20antwi%20owusu%20website%20photo.jpg";

export const metadata: Metadata = {
  title: "About | Yaw Antwi Owusu",
  description: ABOUT_DESCRIPTION,
  keywords: [
    "Yaw Antwi Owusu",
    "Ghana",
    "product",
    "design",
    "entrepreneurship",
    "Daakye Digital",
    "Printmote",
    "emerging markets",
  ],
  openGraph: {
    title: "About | Yaw Antwi Owusu",
    description: ABOUT_DESCRIPTION,
    url: `${SITE_URL}/about`,
    siteName: "Yaw Antwi-Owusu",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: absoluteUrl(ABOUT_IMAGE_PATH),
        alt: "Yaw Antwi-Owusu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Yaw Antwi Owusu",
    description: ABOUT_DESCRIPTION,
    images: [absoluteUrl(ABOUT_IMAGE_PATH)],
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  robots: { index: true, follow: true },
};

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yawantwiowusu/" },
  { label: "Twitter", href: "https://twitter.com/yawantwiowusu" },
  { label: "Mail", href: "mailto:me@yawantwiowusu.com" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <AboutSection />
      <Footer links={socialLinks} />
    </main>
  );
}
