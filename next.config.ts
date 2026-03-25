import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'christuniversity.in',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
