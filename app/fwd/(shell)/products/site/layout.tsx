import { ProductSubnav } from "@/components/fwd/ProductSubnav";
import { getProduct } from "@/lib/fwd/products";

export default function SiteProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const product = getProduct("site")!;
  return (
    <div>
      <ProductSubnav product={product} />
      {children}
    </div>
  );
}
