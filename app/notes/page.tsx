import SiteHeader from "@/components/SiteHeader";
import NotesSection from "@/components/NotesSection";
import Footer from "@/components/Footer";

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
