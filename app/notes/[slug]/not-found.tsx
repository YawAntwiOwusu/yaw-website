import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#02001A] flex flex-col">
      <Header />
      <div className="flex-1 page-padding py-16 md:py-24">
        <div className="page-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Note Not Found
            </h1>
            <p className="text-white/80 text-lg mb-8">
              The note you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/notes"
              className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200"
            >
              Back to Notes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

