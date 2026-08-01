const nextConfig = {
  output: "standalone",
  eslint: {
    // Memaksa build tetap jalan meskipun ada error ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Memaksa build tetap jalan meskipun ada error tipe data TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;