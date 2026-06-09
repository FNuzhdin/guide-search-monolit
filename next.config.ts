import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://test.monolit-calculator.ru/api/:path*',
      },
    ];
  },

};

export default nextConfig;