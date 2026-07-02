import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Application Submitted",
};

export default async function ApplySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <Card>
        <CardContent className="py-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Application Submitted!
          </h1>
          <p className="mt-4 text-slate-600">
            Thank you for applying to First Domain. We&apos;ve sent a
            confirmation email with next steps.
          </p>
          {params.id && (
            <p className="mt-2 text-xs text-slate-400">
              Reference: {params.id.slice(0, 8)}...
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/firstdomain">Back to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/firstdomain/winners">View Winners</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
