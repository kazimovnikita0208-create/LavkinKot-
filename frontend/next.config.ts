import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    unoptimized: true, // Supabase Storage CDN уже оптимизирует
  },

  // Сжатие ответов
  compress: true,

  // Убираем лишние заголовки X-Powered-By
  poweredByHeader: false,

  // Экспериментальные оптимизации
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
