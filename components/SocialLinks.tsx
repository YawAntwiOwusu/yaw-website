interface SocialLink {
  label: string;
  href: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

export default function SocialLinks({ links, className = "" }: SocialLinksProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors duration-200"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

