import Logo from "./Logo";
import Navigation from "./Navigation";

export default function SiteHeader() {
  return (
    <header className="w-full page-padding pt-8 md:pt-10 pb-6 md:pb-8">
      <div className="page-container flex flex-row justify-between items-center gap-6">
        <Logo className="shrink-0" />
        <Navigation />
      </div>
    </header>
  );
}
