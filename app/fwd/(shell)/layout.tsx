import { connection } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { FwdSidebar } from "@/components/fwd/FwdSidebar";
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
  await connection();

  if (!isAdminAuthConfigured()) {
    redirect("/fwd/sign-in");
  }

  if (!(await isAdminAuthenticated())) {
    redirect("/fwd/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <FwdSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
