/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    // Lint is run separately in CI; do not block production builds on lint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
