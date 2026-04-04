import Logo from "./Logo";
import Navigation from "./Navigation";

export default function SiteHeader() {
  return (
    <header className="w-full page-padding pt-8 md:pt-10 pb-6 md:pb-8">
      <div className="page-container flex flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
        <Logo className="shrink-0" />
        <Navigation className="shrink-0" />
      </div>
    </header>
  );
}
