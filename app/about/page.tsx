import SiteHeader from "@/components/SiteHeader";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

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
