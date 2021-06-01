import ReactGA from 'react-ga';
import { isDev } from '../helpers';

let isGAInitialized = false;

export const initializeGA = () => {
  if (!isGAInitialized) {
    ReactGA.initialize(process.env.PREACT_APP_GA_APPID, { debug: isDev() });
    isGAInitialized = true;
  }
}

export const logPageViewGA = (page, resetReferrer) => {
  if (!isGAInitialized) {
    initializeGA();
  }

  if (resetReferrer) {
    ReactGA.set({ referrer: '' });
  }

  ReactGA.pageview(page);
}

export const setGAUserId = (userId) => {
  if (!isGAInitialized) {
    initializeGA();
  }

  ReactGA.set({ userId, anonymizeIp: true, forceSSL: true });
}