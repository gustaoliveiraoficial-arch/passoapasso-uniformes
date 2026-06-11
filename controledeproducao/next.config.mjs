/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '../../../../../../temp/producao-build',
  basePath: '/controledeproducao',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
