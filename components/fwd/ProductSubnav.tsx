import Link from "next/link";
import type { FwdProduct } from "@/lib/fwd/products";

export function ProductSubnav({ product }: { product: FwdProduct }) {
  return (
    <div className="mb-8 border-b border-slate-200 pb-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Product
      </p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h2>
      <nav className="mt-3 flex flex-wrap gap-3">
        {product.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
