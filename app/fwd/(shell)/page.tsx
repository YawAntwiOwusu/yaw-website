import Link from "next/link";
import { products } from "@/lib/fwd/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "FWD — Products" };
export const dynamic = "force-dynamic";

export default function FwdHubPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Products</h1>
      <p className="mt-1 text-slate-600">
        Manage site content and First Domain from one control plane.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <Card key={product.slug}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={product.href}>Open {product.name}</Link>
              </Button>
              {product.nav.slice(1, 4).map((item) => (
                <Button key={item.href} asChild variant="outline">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/fwd/media">Media library</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/fwd/analytics">Analytics</Link>
        </Button>
      </div>
    </div>
  );
}
