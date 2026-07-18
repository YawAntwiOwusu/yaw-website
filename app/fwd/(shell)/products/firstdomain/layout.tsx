import { ProductSubnav } from "@/components/fwd/ProductSubnav";
import { getProduct } from "@/lib/fwd/products";

export default function FirstDomainProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const product = getProduct("firstdomain")!;
  return (
    <div>
      <ProductSubnav product={product} />
      {children}
    </div>
  );
}
