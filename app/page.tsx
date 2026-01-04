import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yawantwiowusu/" },
  { label: "Twitter", href: "https://twitter.com/yawantwiowusu" },
  { label: "Mail", href: "mailto:me@yawantwiowusu.com" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#02001A] flex flex-col">
      <Header />
      <div className="flex-1 page-padding pb-16 md:pb-24">
        <div className="page-container flex flex-col justify-between min-h-[calc(100vh-200px)]">
          <Hero className="mt-12 md:mt-20" />
          <SocialLinks links={socialLinks} className="mt-16 md:mt-24" />
        </div>
      </div>
    </main>
  );
}

