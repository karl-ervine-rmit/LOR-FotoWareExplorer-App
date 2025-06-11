/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rmit.fotoware.cloud',
        pathname: '/fotoweb/**',
      },
    ],
  },
  // Allow development origins
  allowedDevOrigins: ['192.168.0.228:3002'],
};

module.exports = nextConfig;