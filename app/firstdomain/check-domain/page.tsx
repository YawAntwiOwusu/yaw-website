import { DomainChecker } from "@/components/firstdomain/DomainChecker";

export const metadata = {
  title: "Check Domain Availability",
};

export default function CheckDomainPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Check Domain Availability
        </h1>
        <p className="mt-2 text-slate-600">
          Search for your preferred domain before applying to First Domain.
        </p>
      </div>
      <DomainChecker />
    </div>
  );
}
