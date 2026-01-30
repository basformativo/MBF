import type { NextConfig } from "next";

const getDirectusHostname = () => {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!url) return 'localhost';
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split(':')[0];
  }
};

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'directuscontrol.basketformativo.com',
      },
      {
        protocol: 'http',
        hostname: getDirectusHostname(),
      },
      {
        protocol: 'https',
        hostname: getDirectusHostname(),
      },
    ],
  },
};

export default nextConfig;
