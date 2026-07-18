import { connection } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { FwdShellNav } from "@/components/fwd/FwdShellNav";
import { isAdminAuthConfigured } from "@/lib/fwd/auth/config";
import { isAdminAuthenticated } from "@/lib/fwd/auth/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function FwdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();
  // Ensure env is read at request time on Vercel (Next 16), not baked at build.
  await connection();

  if (!isAdminAuthConfigured()) {
    redirect("/fwd/sign-in");
  }

  if (!(await isAdminAuthenticated())) {
    redirect("/fwd/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <FwdShellNav />
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  );
}
