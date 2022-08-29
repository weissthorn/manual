module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  devIndicators: {
    buildActivity: false,
  },
  poweredByHeader: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: true,
  },
};
