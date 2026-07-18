import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/fwd/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/api/fwd/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/notes/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/firstdomain/admin/sign-in",
        destination: "/fwd/sign-in",
        permanent: false,
      },
      {
        source: "/firstdomain/admin",
        destination: "/fwd/products/firstdomain",
        permanent: false,
      },
      {
        source: "/firstdomain/admin/:path*",
        destination: "/fwd/products/firstdomain/:path*",
        permanent: false,
      },
      {
        source: "/fwd/products/site",
        destination: "/fwd",
        permanent: false,
      },
      {
        source: "/fwd/products/site/blog",
        destination: "/fwd/blog",
        permanent: false,
      },
      {
        source: "/fwd/products/site/blog/new",
        destination: "/fwd/blog/new",
        permanent: false,
      },
      {
        source: "/fwd/products/site/blog/:id",
        destination: "/fwd/blog/:id",
        permanent: false,
      },
      {
        source: "/fwd/products/site/projects",
        destination: "/fwd/projects",
        permanent: false,
      },
      {
        source: "/fwd/products/site/comments",
        destination: "/fwd/comments",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
