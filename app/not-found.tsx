import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center page-padding">
      <h1 className="text-4xl font-bold text-foreground mb-4">Page not found</h1>
      <p className="text-muted mb-8 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="text-accent underline hover:opacity-80">
        Back home
      </Link>
    </main>
  );
}
