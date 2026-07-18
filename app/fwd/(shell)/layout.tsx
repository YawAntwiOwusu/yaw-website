import { FwdShellNav } from "@/components/fwd/FwdShellNav";

export default function FwdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <FwdShellNav />
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  );
}
