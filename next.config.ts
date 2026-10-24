import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/pesan-aki",
        destination: "/home/pesan-aki",
        permanent: true,
      },
      {
        source: "/layanan",
        destination: "/home/layanan",
        permanent: true,
      },
      {
        source: "/lokasi",
        destination: "/home/lokasi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
