/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["firebase"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'christuniversity.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
