import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="w-full page-padding py-8 md:py-10">
      <div className="page-container flex justify-between items-center">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}

