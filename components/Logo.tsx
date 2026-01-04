import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <Image
        src="/yawlogo.png"
        alt="Yaw logo"
        width={191.49}
        height={96.44}
        priority
      />
    </Link>
  );
}