import { h } from 'preact';
import { connect } from 'react-redux';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';
import { useEffect } from 'preact/hooks';

import { logGAEvent } from 'Shared/ga';

import { setUserData } from '../../../../redux/actions';
import { getDeviceType } from '../../../../helpers';

import MobileOnboarding from './MobileModal';

const Onboarding = ({ isOnboarded, setUserDataAction }) => {
  const { post, error, data } = useFetch(buildURL('/users/onboarding'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (!error && data && data.user) {
      setUserDataAction(data.user);
    }
  }, [data, error, setUserDataAction]);

  const updateOnboarding = (userSkipped = false) => {
    if (userSkipped) {
      logGAEvent(
        'onboarding',
        'user-skipped-onboarding',
        getDeviceType(),
      );
    } else {
      logGAEvent(
        'onboarding',
        'user-completed-onboarding',
        getDeviceType(),
      );
    }

    post();
  };

  if (isOnboarded) {
    return null;
  }

  return <MobileOnboarding updateOnboarding={updateOnboarding} error={error} />
};

export default connect(
  ({ user: { isOnboarded }}) => ({ isOnboarded }),
  { setUserDataAction: setUserData },
)(Onboarding);
