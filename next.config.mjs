/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
      domains: ['library.pioneercommunity.org.my', 'pioneer.damienslab.com', 'united.damienslab.com', 'localhost'],  // Add localhost here
    },
};
export default nextConfig;
