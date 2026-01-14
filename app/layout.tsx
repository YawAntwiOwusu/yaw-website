import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yaw Antwi Owusu - Operator, Designer & Entrepreneur",
  description: " I am Yaw Antwi Owusu, an Operator, Designer & Entrepreneur working at the intersection of product development, design, and growth.",
  openGraph: {
    title: "Yaw Antwi Owusu - Operator, Designer & Entrepreneur",
    description: " I am Yaw Antwi Owusu, an Operator, Designer & Entrepreneur working at the intersection of product development, design, and growth.",
    url: "https://yawantwiowusu.com",
    siteName: "Yaw Antwi Owusu",
    images: [
      { url: "/yawlogo.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

