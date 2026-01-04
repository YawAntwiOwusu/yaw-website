import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#02001A] flex flex-col">
      <Header />
      <div className="flex-1 page-padding py-16 md:py-24">
        <div className="page-container">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About
          </h1>
          <div className="text-white/80 text-lg leading-relaxed space-y-6">
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

