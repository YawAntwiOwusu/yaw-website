import { ApplicationForm } from "@/components/firstdomain/ApplicationForm";
import { getOpenCycle } from "@/lib/firstdomain/actions/submit-application";

export const metadata = {
  title: "Apply",
};

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  let openCycle = null;
  try {
    openCycle = await getOpenCycle();
  } catch {
    // DB not configured
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Apply to First Domain</h1>
        <p className="mt-2 text-slate-600">
          Complete your application for the domain you selected. You can review
          and edit your domain before submitting.
        </p>
      </div>
      <ApplicationForm
        applicationsOpen={!!openCycle}
        cycleName={openCycle?.name}
      />
    </div>
  );
}
