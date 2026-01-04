interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  return (
    <section className={`max-w-4xl ${className}`}>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
        Hi I&apos;m Yaw, Operator,
        <br />
        Designer & Entrepreneur
      </h1>
      <div className="space-y-6 text-lg md:text-xl text-white/90 leading-relaxed">
        <p>
          I work at the intersection of product development, design, and growth at{" "}
          <a
            href="https://daakyedigital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            Daakye Digital
          </a>
          , where I drive innovation and revenue.
        </p>
        <p>
          I&apos;m the founder of{" "}
          <a
            href="https://printmote.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            Printmote
          </a>
          , building digital infrastructure for Africa&apos;s $50 billion print economy, and I research and publish market intelligence on Ghana&apos;s digital economy through{" "}
          <a
            href="https://233founders.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            233Founders
          </a>
          .
        </p>
      </div>
    </section>
  );
}

