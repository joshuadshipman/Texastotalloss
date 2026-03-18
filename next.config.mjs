/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vpsvttosndxobhicofve.supabase.co',
      },
    ],
  },
};

export default nextConfig;
