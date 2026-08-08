const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
module.exports = {
  i18n,
  compress: true,
  poweredByHeader: false,

  env: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  },

  images: {
    remotePatterns: [
      // Payload CMS media — dev
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/file/**',
      },
      // Payload CMS media — production (update hostname when deploying)
      {
        protocol: 'https',
        hostname: 'cms.housejapanesecurry.co.id',
        port: '',
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [25, 50, 75, 85, 100],
  },
};