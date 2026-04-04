import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="w-full page-padding py-8 md:py-10">
      <div className="page-container flex items-center justify-between gap-4 sm:gap-6 md:gap-8">
        <Logo className="shrink-0" />
        <Navigation className="shrink-0" />
      </div>
    </header>
  );
}

