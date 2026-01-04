import Link from "next/link";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  return (
    <nav className={`flex justify-end space-x-8 ${className}`}>
      <Link
        href="/notes"
        className="text-white hover:opacity-80 transition-opacity duration-200"
      >
        Notes
      </Link>
      <Link
        href="/about"
        className="text-white hover:opacity-80 transition-opacity duration-200"
      >
        About
      </Link>
    </nav>
  );
}

