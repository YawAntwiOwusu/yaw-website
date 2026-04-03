export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 page-padding py-16 md:py-24 border-t border-neutral-200"
      aria-labelledby="about-heading"
    >
      <div className="page-container">
        <h2
          id="about-heading"
          className="text-4xl md:text-5xl font-bold text-foreground mb-8"
        >
          About
        </h2>
        <div className="text-muted text-lg leading-relaxed space-y-6">
          <p>Coming soon...</p>
        </div>
      </div>
    </section>
  );
}
