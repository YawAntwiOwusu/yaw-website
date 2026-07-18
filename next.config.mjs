import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
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
    ];
  },
};

export default nextConfig;
