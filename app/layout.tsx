import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, siteMetadataBase } from "@/lib/site";
import "./globals.css";

const googleSans = Google_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-google-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase,
  title: "Yaw Antwi Owusu - Operator, Designer & Entrepreneur",
  description: "I am Yaw Antwi Owusu, an Operator, Designer & Entrepreneur working at the intersection of product development, design, and growth.",
  openGraph: {
    title: "Yaw Antwi Owusu - Operator, Designer & Entrepreneur",
    description: "I am Yaw Antwi Owusu, an Operator, Designer & Entrepreneur working at the intersection of product development, design, and growth.",
    url: `${SITE_URL}/`,
    siteName: "Yaw Antwi Owusu",
    images: [{ url: "/yawlogo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={googleSans.variable}>
      <body className={`${googleSans.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
