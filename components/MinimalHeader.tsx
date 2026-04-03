import SiteHeader from "./SiteHeader";

/** Same top bar as the rest of the site (logo + Notes / About). */
export default function MinimalHeader() {
  return (
    <div className="border-b border-neutral-200">
      <SiteHeader />
    </div>
  );
}
