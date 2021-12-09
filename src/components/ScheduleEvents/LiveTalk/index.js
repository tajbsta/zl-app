import {
  Box,
  Text,
  Grid,
  Heading,
  Button,
} from 'grommet';
import { format, isSameDay } from 'date-fns';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink, faLockAlt } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';
import { inRange } from 'lodash-es';

import { buildURL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import { hasPermission } from 'Components/Authorize';
import EditButton from 'Components/AdminEditWrappers/EditButton';
import BaseHabitatCard from 'Components/HabitatCard/HabitatCardBase';
import Dialog from 'Components/modals/Dialog';
import LoaderModal from 'Components/LoaderModal';
import ErrorModal from 'Components/modals/Error';
import SuccessModal from 'Components/modals/Success';

import { useIsMobileSize } from '../../../hooks';
import { showEditEventModal } from '../actions';
import { goToSignup } from '../../../routes/home/helpers';
import { goToHabitatPage } from '../../../routes/habitat/helpers';
import HabitatImage from '../HabitatImage';

import style from './style.scss';

const TalkSchedule = ({
  id,
  animal,
  zooLogo,
  habitatImage,
  title,
  startTime,
  stopTime,
  description,
  habitatSlug,
  habitatDescription,
  zooSlug,
  wideImage,
  isStreamOn,
  isHostStreamOn,
  habitatId,
  businessHourId,
  subscription,
  editDisabled = false,
  showEditEventModalAction,
  isLoggedIn,
}) => {
  const isSmallScreen = useIsMobileSize();
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  const {
    post,
    response: reminderResponse,
    loading: sendingReminder,
  } = useFetch(buildURL(), { credentials: 'include', cachePolicy: 'no-cache' });

  const unauthorizedInteraction = () => {
    setShowSignUpDialog(true);
  }

  const sendInvitationHandler = async () => {
    setShowDialog(false)
    await post('/schedules/reminder', { scheduleId: id });
    if (reminderResponse.ok) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true)
    }
  }

  const goToHabitat = () => {
    if (isLoggedIn) {
      goToHabitatPage(zooSlug, habitatSlug);
    } else {
      unauthorizedInteraction();
    }
  }

  const onClickTimeHandler = () => {
    if (isLoggedIn) {
      if (inRange(Date.now(), Date.parse(startTime), Date.parse(stopTime))) {
        goToHabitat();
      } else {
        setShowDialog(true);
      }
    } else {
      unauthorizedInteraction();
    }
  }

  const timeLabel = inRange(Date.now(), Date.parse(startTime), Date.parse(stopTime)) ? 'Now' : format(Date.parse(startTime), 'hh:mm aa');

  if (isSmallScreen) {
    return (
      <Box className={style.mobile}>
        <BaseHabitatCard
          image={wideImage}
          logo={zooLogo}
          online={isStreamOn}
          liveTalk={isHostStreamOn}
        >
          <Box flex="grow">
            <div onClick={() => goToHabitat()} className={style.name}>
              <Heading level="4" margin="0px">{animal}</Heading>
              <FontAwesomeIcon className={style.externalLinkIcon} icon={ faExternalLink } />
            </div>
            <Text size="medium" margin={{ top: 'small' }}>
              {description}
            </Text>
          </Box>
          <Box>
            <Box flex="grow">
              <Box className={style.textBox}>
                <Text size="xlarge" margin={{ bottom: 'xsmall', top: 'medium' }}>{title}</Text>
                <Text margin={{ bottom: 'small' }}>{description}</Text>
              </Box>
              {(subscription.productId !== 'FREEMIUM' || subscription.freeHabitat === habitatId) && (
                <div>
                  <PrimaryButton
                    size="small"
                    label={timeLabel}
                    onClick={onClickTimeHandler}
                  />
                </div>
              )}
              {(subscription.productId === 'FREEMIUM' && subscription.freeHabitat !== habitatId) && (
                <div>
                  <Link href={encodeURI(`/plans`)}>
                    <Button
                      primary
                      label={(
                        <Box direction="row" justify="center" align="center">
                          <FontAwesomeIcon icon={faLockAlt} color="#2E2D2D" size="1x" />
                          <Text className={style.buttonText}>
                            {format(Date.parse(startTime), 'hh:mm aa')}
                          </Text>
                        </Box>
                      )}
                      size="small"
                      className={style.lockButtonMobile}
                    />
                  </Link>
                </div>
              )}
            </Box>
          </Box>
        </BaseHabitatCard>
        {showDialog && (
          <Dialog
            title="Send reminder?"
            text="We'll send a calendar invite to your email."
            buttonLabel="Remind me"
            onConfirm={sendInvitationHandler}
            onCancel={() => setShowDialog(false)}
          />
        )}
        {showSignUpDialog && (
          <SignUpDialog setShowSignUpDialog={setShowSignUpDialog} />
        )}
        {sendingReminder && (<LoaderModal />)}
        {showErrorModal && (
          <ErrorModal
            text="Something went wrong. Please try again"
            onClose={() => setShowErrorModal(false)}
          />
        )}
        {showSuccessModal && (
          <SuccessModal
            text="Invitation sent! Please check your inbox."
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </Box>
    );
  }

  const calcTime = () => {
    const start = new Date(startTime);
    const end = new Date(stopTime);
    const duration = `${(end - start) / (1000 * 60)} MINS`;
    const date = isSameDay(start, new Date()) ? 'Today' : `${format(start, 'EEE MMM d HH:mm aa')}`;

    return (
      <Text size="10px" weight={700} className={style.date}>
        {`${duration} | ${date}`.toUpperCase()}
      </Text>
    );
  }

  return (
    <Box className={style.scheduleItem}>
      <Box direction="row" className={style.header}>
        <div onClick={() => goToHabitat()} className={style.imageWrapper}>
          <HabitatImage image={habitatImage} />
          {/* We need to load this from the habitats, size contraints should be defined on api */}
          <div className={style.logo}>
            <img src={zooLogo} alt="" />
          </div>
        </div>
        <Box justify="center" margin={{ left: 'medium' }} className={style.textWrapper}>
          <div onClick={() => goToHabitat()} className={style.name}>
            <Heading level="3" margin="0px">{animal}</Heading>
            <FontAwesomeIcon className={style.externalLinkIcon} icon={ faExternalLink } />
          </div>
          <Text size="xlarge" margin={{ top: 'small' }} >
            {habitatDescription}
          </Text>
        </Box>
      </Box>

      <Box className={style.body}>
        <Box flex="grow">
          <Box className={style.textBox}>
            <Heading level="4" margin="0px">{title}</Heading>
            {calcTime()}
            <Text size="xlarge">
              {description}
            </Text>
          </Box>
          <Grid
            gap ="xsmall"
            margin={{ top: 'auto' }}
            height="xxsmall"
            columns={['auto', 'auto', 'auto']}
            rows="xxsmall"
          >
            {!editDisabled && hasPermission('habitat:edit-schedule') && (
              <EditButton onClick={() => showEditEventModalAction(true, {
                _id: id,
                start: startTime,
                businessHourId,
                habitatId,
                description,
              })} />
            )}
            {(subscription.productId !== 'FREEMIUM' || subscription.freeHabitat === habitatId) && (
              <PrimaryButton
                label={timeLabel}
                className={style.sessionButton}
                onClick={onClickTimeHandler}
              />
            )}
            {(subscription.productId === 'FREEMIUM' && subscription.freeHabitat !== habitatId) && (
              <Link href={encodeURI(`/plans`)}>
                <Button
                  primary
                  label={(
                    <Box direction="row" justify="center" align="center">
                      <FontAwesomeIcon icon={faLockAlt} color="#2E2D2D" size="1x" />
                      <Text className={style.buttonText}>
                        {format(Date.parse(startTime), 'hh:mm aa')}
                      </Text>
                    </Box>
                  )}
                  size="large"
                  className={style.lockButton}
                />
              </Link>
            )}
          </Grid>
        </Box>
      </Box>

      {showDialog && (
        <Dialog
          title="Send reminder?"
          text="We'll send a calendar invite to your email."
          buttonLabel="Remind me"
          onConfirm={sendInvitationHandler}
          onCancel={() => setShowDialog(false)}
        />
      )}
      {showSignUpDialog && (
        <SignUpDialog setShowSignUpDialog={setShowSignUpDialog} />
      )}
      {sendingReminder && (<LoaderModal />)}
      {showErrorModal && (
        <ErrorModal
          text="Something went wrong. Please try again"
          onClose={() => setShowErrorModal(false)}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          text="Invitation sent! Please check your inbox."
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </Box>
  );
};

const SignUpDialog = ({ setShowSignUpDialog }) => (
  <Dialog
      title="Join Zoolife to access."
      text="Expert talks and habitats from zoos and sanctuaries around the world await!"
      buttonLabel="Sign Up Now"
      onConfirm={() => goToSignup()}
      onCancel={() => setShowSignUpDialog(false)}
    />
)

export default connect(
  ({ user: { subscription, logged }}) => ({ subscription, isLoggedIn: logged }),
  { showEditEventModalAction: showEditEventModal },
)(TalkSchedule);
