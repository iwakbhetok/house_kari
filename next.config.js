const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
module.exports = {
  i18n,

  env: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ops.housejapanesecurry.com',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};