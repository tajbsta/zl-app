import { Router, route } from 'preact-router';
import { Box } from 'grommet';
import {
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js/pure';

import TimeBar from 'Components/TimeBar';
import AuthGuard from 'Components/Authorize/AuthGuard';
import Header from 'Components/Header';
import Redirect from 'Components/Redirect';
import TermsAndConditions from 'Components/TermsAndConditions';
import { PRIVACY_PDF_URL, TERMS_PDF_URL } from 'Components/TermsAndConditions/constants';
import ContactUsModalLoader from 'Components/async/ContactUsModalLoader';
import InviteModalLoader from 'Components/async/InviteModalLoader';
import HabitatsUpdater from 'Components/HabitatsUpdater';
import WhatsNew from 'Components/WhatsNew';
import GiftPopUp from 'Components/GiftPopUp';
import AppLoader from 'Components/AppLoader';

import { logPageViewGA } from 'Shared/ga';
import { patch, post, buildURL } from 'Shared/fetch';
import { StripeContext } from 'Shared/context';

import oranaZooLogo from './partners/orana-zoo.png';
import torontoZooLogo from './partners/toronto-zoo.png';
import pmmcLogo from './partners/pmmc.png';
import sanAntonioLogo from './partners/san-antonio-zoo.png';
import santaBarbaraLogo from './partners/santa-barbara-zoo.png';

// Code-splitting is automated for `routes` directory
import PasswordReset from '../../routes/passwordReset';
import Home from '../../routes/home';
import Signup from '../../routes/signup';
import Login from '../../routes/login';
import Profile from '../../routes/profile';
import NotFound from '../../routes/notFound';
import DesignSystem from '../../routes/designSystem';
import RedirectPage from '../../routes/redirectPage';
import TermsAndPrivacy from '../../routes/TermsAndPrivacy';
import AdminRouter from './AdminRouter';
import MobileGuard from './MobileGuard';
import Album from '../../routes/album';
import Plans from '../../routes/plans';
import Map from '../../routes/map';
import Schedule from '../../routes/schedule';
import TalkSchedule from '../../routes/talkSchedule';
import Favorite from '../../routes/favorite';
import Account from '../../routes/account';
import Habitat from '../../routes/habitat';
import Welcome from '../../routes/welcome';
import Prices from '../../routes/prices';
import FreemiumOnboarding from '../../routes/freemiumOnboarding';
import Redeem from '../../routes/redeem';
import Gift from '../../routes/gift';

import PageWrapper from './PageWrapper';

import { logAndGetCampaignData, isProfileSet } from '../../helpers';
import { updateReferralData } from '../../redux/actions';
import { useIsHabitatTabbed } from '../../hooks';

const homeTitle = "The world's first virtual zoo.";
const freemiumRoutes = [
  '/',
  '/torontozoo',
  '/twitch',
  '/orana',
  '/oranapark',
  '/pmmc',
  '/pmmccamp',
  '/sazoo',
  '/freemiumOnboarding',
  '/socialLogin',
  '/sbzoo',
  '/prices',
];

const Main = ({
  onRouteChange,
  showContactUs,
  showInvite,
  logged,
  productId,
  isFreemiumOnboarded,
  timezone,
  profile,
  isGiftCardUser,
  updateReferralDataAction,
  subscription,
}) => {
  const [path, setPath] = useState();
  const isTabbed = useIsHabitatTabbed();
  const isTabbedHabitatPath = isTabbed && path?.startsWith('/h/');
  const { stripe } = useContext(StripeContext);
  useEffect(() => {
    const campaignData = logAndGetCampaignData();
    updateReferralDataAction(campaignData);
  }, [updateReferralDataAction]);

  useEffect(() => {
    const { timeZone: clientTimezone } = Intl.DateTimeFormat().resolvedOptions();
    if (logged && timezone !== clientTimezone) {
      patch(buildURL('/users/timezone'), { timezone: clientTimezone })
        .catch((error) => console.error('Failed to update timezone', error));
    }
  }, [logged, timezone]);

  useEffect(() => {
    if (logged && !isProfileSet(profile)) {
      if (isGiftCardUser && !subscription.active) {
        route('/redeem', true);
        setPath('/redeem');
      } else {
        route('/profile', true);
        setPath('/profile');
      }
    }
  }, [logged, profile, isGiftCardUser, subscription]);

  const checkoutHandler = useCallback(async (planId, priceId) => {
    try {
      const session = await post(buildURL(`/checkout/${planId}/${priceId}`));
      if (!stripe?.redirectToCheckout) {
        // in case theres a problem with loading stripe, we should try to load it again
        const localStripe = await loadStripe(process.env.PREACT_APP_STRIPE_PUBLIC_KEY);
        await localStripe.redirectToCheckout(session);
        return;
      }
      await stripe.redirectToCheckout(session);
    } catch (err) {
      console.error('Error trying to start checkout process', err);
      // TODO: display error modal
    }
  }, [stripe])

  const routerChangeHandler = (props) => {
    const {
      url,
      current: { props: { matches } },
    } = props;

    if (logged && !isProfileSet(profile)) {
      if (!url.includes('redeem')) {
        route('/profile', true);
        setPath('/profile');
      }
    } else if (!freemiumRoutes.includes(url) && !isFreemiumOnboarded && productId === 'FREEMIUM') {
      route('/freemiumOnboarding', true);
      setPath('/freemiumOnboarding');
    }

    if (url.startsWith('/socialLogin')) {
      logPageViewGA('/socialLogin', true);
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'SocialLogin');
      }

      if (matches?.newUser === "true") {
        logPageViewGA('/signed-up');
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('trackCustom', 'SignedUp');
        }

        if (matches?.price && matches?.plan) {
          checkoutHandler(matches.plan, matches.price);
          return;
        }
      }

      if (!isFreemiumOnboarded && productId === 'FREEMIUM') {
        route('/freemiumOnboarding', true);
        setPath('/freemiumOnboarding')
      } else {
        onRouteChange(props);
        setPath(url);
      }
      return;
    }

    if (url.startsWith('/checkout-completed')) {
      logPageViewGA('/checkout-completed', true);
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'CheckoutCompleted');
      }

      const { passType, price } = matches;

      if (passType) {
        logPageViewGA(`/purchased-${passType}`);
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('trackCustom', `Purchased${passType}`);
          if (price) {
            const formattedPrice = parseInt(price, 10) / 100;
            window.fbq('track', 'Purchase', { currency: "USD", value: formattedPrice, passType });
          }
        }
      }
      onRouteChange(props);
      setPath(url);
      return
    }
    setPath(url);
    logPageViewGA(url);
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }

    onRouteChange(props);
  }

  return (
    <Box fill className="calculated-full-height">
      <Router onChange={routerChangeHandler}>
        <Home path="/" exact title={homeTitle} />
        <Home path="/twitch" exact title={homeTitle} />
        <Home path="/oranapark" partnerImage={oranaZooLogo} exact title={homeTitle} partner="orana" />
        <Home path="/orana" partnerImage={oranaZooLogo} exact title={homeTitle} partner="orana" />
        <Home path="/torontozoo" partnerImage={torontoZooLogo} exact title={homeTitle} partner="torontozoo" />
        <Home path="/pmmc" partnerImage={pmmcLogo} exact title={homeTitle} partner="pmmc" />
        <Home path="/pmmccamp" partnerImage={pmmcLogo} exact title={homeTitle} partner="pmmc" />
        <Home path="/sazoo" partnerImage={sanAntonioLogo} exact title={homeTitle} partner="sazoo" />
        <Home path="/sbzoo" partnerImage={santaBarbaraLogo} exact title={homeTitle} partner="sbzoo" />
        <Prices path="/prices" exact title="Pricing" />
        <Redirect path="/socialLogin" to="/map" />
        <Redirect path="/checkout-completed" to="/welcome" />
        <Redirect path="/checkout-cancelled" to="/plans" />

        <AuthGuard path="/login" guestOnly title="Log In" redirectTo="/map">
          <Login />
        </AuthGuard>

        <AuthGuard path="/signup" guestOnly title="Sign Up" redirectTo="/map">
          <Signup />
        </AuthGuard>

        <AuthGuard path="/login/token/:token" title="Log In" redirectTo="/map" guestOnly>
          <Login />
        </AuthGuard>

        <PasswordReset path="/passwordReset" title="Reset Password" />

        <AuthGuard permission="profile:edit" path="/profile" title="Profile">
          <Profile step />
        </AuthGuard>

        {/* display 404 instead of Unatuhorized message
            we don't want our viewers to know about this route
            and still redirect unauthenticated users to /login page
            this redirection is there not to confuse our admins */}
        <MobileGuard path="/admin/:*" title="Admin">
          <AuthGuard adminOnly fallback={<NotFound />}>
            <AdminRouter />
          </AuthGuard>
        </MobileGuard>

        {/* TODO: we should consider removing this
            another option is to set ENV variable
            and have this route only in development */}
        <MobileGuard path="/design" title="Design Guideline">
          <AuthGuard adminOnly fallback={<NotFound />}>
            <DesignSystem />
          </AuthGuard>
        </MobileGuard>

        <AuthGuard path="/mobile" phoneOnly title="Our animals are too big" redirectTo="/" permission="redirect:view">
          <RedirectPage />
        </AuthGuard>

        <AuthGuard path="/welcome" redirectTo="/" permission="welcome:view">
          <Header />
          <PageWrapper>
            <Welcome />
          </PageWrapper>
        </AuthGuard>
        <AuthGuard path="/h/:zooName/:habitatSlug" permission="habitat:view" skipTitle redirectTo="/plans">
          <Header />
          <PageWrapper>
            <Habitat />
          </PageWrapper>
        </AuthGuard>
        <AuthGuard path="/map" permission="map:view" title="Map" redirectTo="/plans">
          <Header />
          <PageWrapper>
            <Map />
          </PageWrapper>
        </AuthGuard>
        <AuthGuard path="/schedule" publicPath="/talk-schedule" permission="schedule:view" redirectTo="/talk-schedule">
          <Header />
          <PageWrapper>
            <Schedule />
          </PageWrapper>
        </AuthGuard>
        <AuthGuard path="/talk-schedule" guestOnly redirectTo="/schedule">
          <TalkSchedule />
        </AuthGuard>
        <AuthGuard path="/redeem" permission="redeem:view" redirectTo="/login">
          <Redeem />
        </AuthGuard>
        <Gift path="/gift" />
        <AuthGuard path="/favorite" permission="favorite:edit" redirectTo="/plans">
          <Header />
          <PageWrapper>
            <Favorite />
          </PageWrapper>
        </AuthGuard>
        <AuthGuard path="/account/:activeTab" permission="profile:edit">
          <Header />
          <PageWrapper>
            <Account />
          </PageWrapper>
        </AuthGuard>
        <AuthGuard path="/plans" permission="checkout:plans">
          <Header />
          <PageWrapper>
            <Plans />
          </PageWrapper>
        </AuthGuard>

        <AuthGuard path="/freemiumOnboarding" title="Onboarding" redirectTo="/login" permission="freemiumOnboarding:view">
          <FreemiumOnboarding />
        </AuthGuard>

        <TermsAndPrivacy
          path="/terms-and-conditions"
          title="Terms and Conditions"
          pdfLink={TERMS_PDF_URL}
        />
        <TermsAndPrivacy
          path="/privacy-policy"
          title="Privacy Policy"
          pdfLink={PRIVACY_PDF_URL}
        />

        <Album mediaType="photos" path="/album/photos/:photoId" />
        <Album mediaType="videos" path="/album/videos/:videoId" />

        {/* NOTE: NotFound need to be at the end, on first render path is undefined */}
        {path === undefined ? <AppLoader path=":*" /> : <NotFound path=":*" />}
      </Router>

      {!isTabbedHabitatPath && <TimeBar path={path} />}
      <TermsAndConditions />
      <ContactUsModalLoader isOpen={showContactUs} />
      <InviteModalLoader isOpen={showInvite} />
      <HabitatsUpdater />
      <WhatsNew />
      <GiftPopUp />
    </Box>
  )
};

export default connect(({
  user: {
    logged,
    timezone,
    isFreemiumOnboarded,
    subscription: { productId },
    profile,
    isGiftCardUser,
    subscription,
  },
  modals: { contactus: { isOpen: showContactUs }, invite: { isOpen: showInvite }},
}) => ({
  showContactUs,
  showInvite,
  logged,
  timezone,
  productId,
  isFreemiumOnboarded,
  profile,
  isGiftCardUser,
  subscription,
}), {
  updateReferralDataAction: updateReferralData,
})(Main);
