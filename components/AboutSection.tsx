import Link from "next/link";
import AboutPolaroidStrip from "./AboutPolaroidStrip";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-t border-neutral-200 py-16 md:py-24 page-padding"
      aria-labelledby="about-heading"
    >
      <div className="page-container max-w-5xl">
        <h1
          id="about-heading"
          className="mb-6 text-4xl font-bold text-foreground md:mb-8 md:text-5xl"
        >
          About
        </h1>

        <AboutPolaroidStrip />

        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-lg leading-relaxed text-foreground md:text-[1.0625rem] md:leading-[1.75]">
              <p className="text-xl font-medium leading-snug text-foreground md:text-2xl md:leading-snug">
                I&apos;m a product operator, designer, and entrepreneur building
                and scaling products at the intersection of technology, business,
                and growth in emerging markets.
              </p>

              <p>
                My work is simple in theory but hard in execution: I take
                ambitious ideas and turn them into real, usable,
                revenue-generating products. Not just design. Not just
                strategy. Execution.
              </p>

              <p>
                Over the years, I&apos;ve worked across product development,
                growth, and digital transformation—partnering with founders,
                engineers, and business leaders to move products from early
                concepts to market-ready solutions. I focus on bridging the gap
                between product thinking and business outcomes, making sure what
                gets built actually works in-market.
              </p>

              <p>
                Currently, I work at{" "}
                <Link
                  href="https://daakyedigital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-[3px] hover:opacity-80"
                >
                  Daakye Digital
                </Link>
                , where I focus on product development and commercial growth.
                I&apos;m involved in rolling out digital finance solutions and
                helping international companies enter the Ghanaian market through
                product strategy, go-to-market execution, partnerships, and
                revenue.
              </p>

              <p>
                I&apos;m also the founder of{" "}
                <Link
                  href="https://printmote.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-[3px] hover:opacity-80"
                >
                  Printmote
                </Link>
                , where I&apos;m rethinking how businesses access printing
                services and how print providers operate—optimizing both demand
                discovery and operational efficiency within the print ecosystem.
              </p>

              <p>
                Beyond that, I&apos;m building{" "}
                <Link
                  href="https://233founders.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-[3px] hover:opacity-80"
                >
                  233Founders
                </Link>
                , a platform focused on documenting and showcasing founders,
                operators, and builders across Ghana&apos;s startup
                ecosystem—creating visibility, narrative, and context around the
                people actually doing the work.
              </p>

              <p>
                I also serve as a Cursor Ambassador in Ghana, where I drive
                adoption within the developer ecosystem by organizing events,
                workshops, and build sessions—helping developers integrate
                Cursor into real workflows while expanding its presence across
                local tech communities and universities.
              </p>

              <p>
                Before this, I worked at Dexwin as a product designer,
                contributing to platforms like MyMTN and MTN Pulse as part of MTN
                Ghana&apos;s digital transformation. I led the redesign of
                mtnhoods.com, improving the airtime and data purchase experience
                for over 1 million daily users and introducing new revenue layers
                through in-app advertising.
              </p>

              <p>
                I&apos;ve also built and experimented across multiple ventures.
                As co-founder of Ubadi, I led product strategy and development
                for a fintech platform focused on families. That experience
                gave me a deep understanding of what it takes to search for
                product-market fit within Africa&apos;s financial landscape.
              </p>

              <p>
                I started out in media and digital content, producing and
                designing content that reached millions. That foundation still
                shapes how I think about storytelling, distribution, and growth
                today.
              </p>

              <p className="font-medium text-foreground">
                Right now, my focus is clear: building products, driving revenue,
                and creating systems that scale.
              </p>

              <p>
                If it sits at the intersection of product, growth, and emerging
                markets, I&apos;m either already working on it—or I&apos;m
                thinking about it.
              </p>
          </div>
        </div>
      </div>
    </section>
  );
}
