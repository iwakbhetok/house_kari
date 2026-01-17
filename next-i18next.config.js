const path = require('path');

module.exports = {
  i18n: {
    locales: ['id', 'en', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
};
