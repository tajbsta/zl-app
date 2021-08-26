// This is loaded before envVars on preact.config
// hence dotenv will be used to inject .env
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const envData = {
  segmentId: process.env.PREACT_APP_SEGMENT_ID,
  optimizeId: process.env.PREACT_APP_OPTIMIZE_ID,
  gaId: process.env.PREACT_APP_GA_APPID,
  pixelId: process.env.PREACT_APP_FB_PIXELID,
};

module.exports = [
  {
    url: '/',
    title: 'Zoolife - The world\'s first virtual zoo.',
    ...envData,
  },
  {
    url: '/twitch',
    title: 'Zoolife - The world\'s first virtual zoo.',
    ...envData,
  },
  {
    url: '/oranapark',
    title: 'Zoolife - The world\'s first virtual zoo. - Orana Wildlife Park',
    ...envData,
  },
  {
    url: '/orana',
    title: 'Zoolife - The world\'s first virtual zoo. - Orana Wildlife Park',
    ...envData,
  },
  {
    url: '/torontozoo',
    title: 'Zoolife - The world\'s first virtual zoo. - Toronto Zoo',
    ...envData,
  },
  {
    url: '/pmmc',
    title: 'Zoolife - The world\'s first virtual zoo. - Pacific Marine Mammal Center',
    ...envData,
  },
  {
    url: '/pmmccamp',
    title: 'Zoolife - The world\'s first virtual zoo. - Pacific Marine Mammal Center Camp',
    ...envData,
  },
  {
    url: '/sazoo',
    title: 'Zoolife - The world\'s first virtual zoo. - San Antonio Zoo',
    ...envData,
  },
  {
    url: '/sbzoo',
    title: 'Zoolife - The world\'s first virtual zoo. - Santa Barbara Zoo',
    ...envData,
  },
  {
    url: '/terms-and-conditions',
    title: 'Terms and Conditions',
    ...envData,
  },
  {
    url: '/privacy-policy',
    title: 'Privacy Policy',
    ...envData,
  },
  {
    url: '/album/photos/:photoId',
    title: 'Album',
    ...envData,
  },
  {
    url: '/album/videos/:videoId',
    title: 'Album',
    ...envData,
  },

  // this will prerender only loading indicator
  // we'll use this as fallback on s3
  {
    url: '/account',
    ...envData,
  },
];
