import { SignInForm } from "@/components/fwd/SignInForm";

// Never prerender/cache this page — auth env must be read per-request on Vercel.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function FwdSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      {/* Always show the form. Config errors surface from loginAction at runtime. */}
      <SignInForm />
    </div>
  );
}
