/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined,
  distDir: isProd ? '../../../../../../temp/producao-build' : '.next',
  basePath: '/controledeproducao',
  assetPrefix: isProd ? '/controledeproducao' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
