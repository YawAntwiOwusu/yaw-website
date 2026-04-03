import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yawantwiowusu/" },
  { label: "Twitter", href: "https://twitter.com/yawantwiowusu" },
  { label: "Mail", href: "mailto:me@yawantwiowusu.com" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <div className="flex-1 page-padding pt-4 md:pt-6 pb-0">
        <div className="page-container">
          <Hero className="mb-6 md:mb-8" />
        </div>
      </div>
      <ProjectsSection />
      <Footer links={socialLinks} />
    </main>
  );
}
