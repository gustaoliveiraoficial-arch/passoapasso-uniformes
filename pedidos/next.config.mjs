/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '../../../../../../temp/pedidos-build',
  basePath: '/formalizarpedido',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
