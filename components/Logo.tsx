import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline gap-0.5 text-foreground no-underline hover:opacity-90 ${className}`}
      aria-label="Yaw, home"
    >
      <span className="text-2xl font-black tracking-[0.08em] md:text-3xl md:tracking-[0.1em]">
        YAW
      </span>
      <span className="text-[0.55rem] font-bold leading-none md:text-[0.65rem]">
        ™
      </span>
    </Link>
  );
}