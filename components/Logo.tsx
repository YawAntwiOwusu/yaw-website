import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center leading-none text-foreground no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
      aria-label="Yaw, home"
    >
      <Image
        src="/yawlogo.png"
        alt="YAW"
        width={968}
        height={520}
        className="block h-12 w-auto sm:h-14 md:h-16 lg:h-20"
        priority
        sizes="(max-width: 640px) 230px, (max-width: 1024px) 290px, 360px"
      />
    </Link>
  );
}
