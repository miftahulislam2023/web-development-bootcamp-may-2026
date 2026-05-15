/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'ui-avatars.com'],
  },
};

module.exports = nextConfig;
