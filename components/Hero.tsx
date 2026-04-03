import Link from "next/link";

interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  return (
    <section className={`max-w-4xl ${className}`}>
      <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.12] tracking-tight mb-6 md:mb-7">
        Hi I&apos;m Yaw, Operator,
        <br />
        Designer & Entrepreneur
      </h1>
      <div className="text-lg md:text-xl text-foreground font-normal leading-relaxed space-y-3 md:space-y-3.5">
        <p>
          I work at the intersection of product development, design, and growth at{" "}
          <Link
            href="https://daakyedigital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-[3px] decoration-foreground hover:opacity-80"
          >
            Daakye Digital
          </Link>
          , where I drive innovation and revenue.
        </p>
        <p>
          I&apos;m the founder of{" "}
          <Link
            href="https://printmote.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-[3px] decoration-foreground hover:opacity-80"
          >
            Printmote
          </Link>
          , building digital infrastructure for Africa&apos;s $50 billion print economy, and I research and publish market intelligence on Ghana&apos;s digital economy through{" "}
          <Link
            href="https://233founders.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-[3px] decoration-foreground hover:opacity-80"
          >
            233Founders
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
