import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { connect } from 'react-redux';
import { get } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import classnames from 'classnames';
import {
  Box,
  Text,
  Anchor,
  Heading,
} from 'grommet';

import { buildURL, post } from 'Shared/fetch';
import SocialLoginBar from 'Components/SocialLoginBar';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';

import PasswordResetModal from './ResetModal';
import Layout from '../../layouts/LoginSignup';

import { setUserData } from '../../redux/actions';
import { emailRegex, identifyUser, loadPage } from '../../helpers';

import { showModal, validateToken } from './ResetModal/actions';

import style from './style.scss';

const Login = ({
  setUserDataAction,
  setShowModalAction,
  token, // from URL
  validateTokenAction,
  matches,
  logged,
  profile,
  sessionChecked,
}) => {
  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState();
  const [password, setPassword] = useState();
  const [hasError, setHasError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const { socialLoginError = false } = matches;
    if (socialLoginError && !hasError) {
      setHasError(true);
      setEmailError('Error logging in with social media. Make sure you share your email to proceed.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  useEffect(() => {
    if (logged && profile) {
      loadPage('/map', true);
    } else if (logged) {
      // users who have not followed the regular signup process
      // do not have profile set, redirecting them to generate one
      loadPage('/profile', true);
    }
  }, [logged, profile]);

  useEffect(() => {
    if (token) {
      validateTokenAction(token);
    }
  }, [token, validateTokenAction]);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    let hasEmailError = false;
    let hasPasswordError = false;

    setEmailError();
    setHasError();

    if (!email || !password) {
      if (!email) {
        hasEmailError = true;
        setEmailError('Email cannot be empty');
      }

      if (!password) {
        hasPasswordError = true;
        setHasError('Password cannot be empty');
      }
    }

    if (!hasEmailError && !email?.match(emailRegex)) {
      hasEmailError = true;
      setEmailError('Invalid email');
    }

    if (!hasPasswordError && password?.length < 8) {
      hasPasswordError = true;
      setHasError('Invalid Password');
    }

    if (hasEmailError || hasPasswordError) {
      return;
    }

    try {
      const url = buildURL('/admin/users/login');
      const { userAgent } = navigator;
      const { user } = await post(url, { email, password, userAgent });
      setUserDataAction({ ...user, sessionChecked: true });
      identifyUser(user);
      loadPage('/map');
      try {
        localStorage.setItem('returningUser', true);
      } catch (err) {
        console.warn('Local storage is not available.');
        console.error(err);
      }
    } catch (err) {
      console.error('Error while user logging in', err);
      if (err.statusCode === 401) {
        setHasError(get(err, 'body.error'));
      } else if (err.statusCode === 400) {
        setHasError('Wrong credentials, please try again.');
      } else {
        setHasError('Something went wrong. Please try again!');
      }
    }
  }

  const onUsernameChange = ({ target }) => {
    setEmail(target.value);
  };

  const onPasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  const onSignUp = () => {
    route('/signup');
  }

  if (!sessionChecked || logged) {
    return null;
  }

  return (
    <Box fill width={{ max: 'var(--maxWidth)', min: '350px' }} height={{ min: 'max-content' }} margin={{ horizontal: 'auto'}}>
      <Box direction="row" align="center" background="none" className={style.topNavigationContainer}>
        <Text>
          Don&apos;t have an account?&nbsp;
        </Text>
        <OutlineButton size="medium" label="Sign Up" height="30px" margin={{ left: '16px' }} width={{ min: '85px' }} onClick={onSignUp} />
      </Box>
      <Layout>
        <Box direction="row" align="center" justify="center" height="auto">
          <Heading level="2">Welcome back to Zoolife.</Heading>
        </Box>
        <Box margin={{ top: 'small' }} className={style.navigationContainer}>
          <Text>
            Don&apos;t have an account?&nbsp;
            <Anchor href="/signup" className="small">Sign Up</Anchor>
          </Text>
        </Box>
        <Box fill="horizontal" margin={{ top: 'medium' }}>
          <form onSubmit={onSubmit}>
            <div className={style.inputContainer}>
              <span className={style.label}>Your Email:</span>
              <div className={style.inputWrapper}>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={onUsernameChange}
                  style={{ fontSize: (!email ? '11px' : '20px') }}
                />
              </div>
              <div className={classnames(style.errorSection, {[style.active]: emailError})}>
                {emailError}
              </div>
            </div>
            <div className={style.inputContainer}>
              <span className={style.label}>Your Password:</span>
              <div className={style.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={onPasswordChange}
                  style={{ fontSize: (!password ? '11px' : '20px') }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash } />
                </button>
              </div>
              <div className={classnames(style.errorSection, {[style.active]: hasError})}>
                {hasError}
              </div>
            </div>
            <Box margin={{ bottom: 'large' }}>
              <Anchor onClick={() => setShowModalAction(true)}>
                Forgot password?
              </Anchor>
            </Box>
            <PrimaryButton label="Log in" type="submit" fill="horizontal" />
            <div className={style.separator}>
              <hr />
              <span>or</span>
              <hr />
            </div>
          </form>
        </Box>
        <SocialLoginBar />
        <PasswordResetModal />
      </Layout>
    </Box>
  );
};

export default connect(
  ({ user: { logged, profile, sessionChecked } }) => ({ logged, profile, sessionChecked }),
  {
    setUserDataAction: setUserData,
    setShowModalAction: showModal,
    validateTokenAction: validateToken,
  },
)(Login);
