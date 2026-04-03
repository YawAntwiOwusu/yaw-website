interface SocialLink {
  label: string;
  href: string;
}

interface FooterProps {
  links: SocialLink[];
  className?: string;
}

export default function Footer({ links, className = "" }: FooterProps) {
  return (
    <footer
      className={`border-t border-neutral-200 page-padding py-8 md:py-10 ${className}`}
    >
      <div className="page-container">
        <div className="flex flex-wrap gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
