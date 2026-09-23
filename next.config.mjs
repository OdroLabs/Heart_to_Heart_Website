/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      {
        source: "/:locale/publications",
        destination: "/:locale/resources",
        permanent: true,
      },
      {
        source: "/:locale/publications/:id",
        destination: "/:locale/resources/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
