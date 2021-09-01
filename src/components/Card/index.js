import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useMemo } from 'preact/hooks';
import classnames from 'classnames';
import useFetch from 'use-http';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockAlt } from '@fortawesome/pro-solid-svg-icons';
import { Link } from 'preact-router';
import {
  Button,
  Box,
  Text,
} from 'grommet';

import { buildURL } from 'Shared/fetch';

import { setUserData } from '../../redux/actions';
import { PrimaryButton } from '../Buttons';
import { showScheduleModal } from '../../routes/habitat/components/ScheduleModal/actions';

import style from './style.scss';

const Card = ({
  scheduleId,
  title,
  description,
  zoo,
  startTime,
  header,
  image,
  isReminder,
  onClick,
  loading,
  scheduledEvents,
  setUserDataAction,
  showScheduleModalAction,
  productId,
  freeHabitat,
  habitatId,
}) => {
  const {
    post,
    error,
    data,
    loading: sendingReminder,
  } = useFetch(buildURL('/schedules/reminder'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const isLocked = useMemo(
    () => productId === 'FREEMIUM' && freeHabitat !== habitatId,
    [freeHabitat, productId, habitatId],
  );

  const isReminded = useMemo(() => {
    if (scheduleId || (title && zoo && startTime)) {
      return scheduledEvents.some(({
        scheduleId: eventScheduleId,
        title: eventTitle,
        zoo: eventZoo,
        startTime: eventStart,
      }) => {
        const sameScheduleId = eventScheduleId === scheduleId;
        // in case we re-generate new schedules, IDs will be different therefore
        // we need to compare event other info to check if user already received a reminder
        const sameEventInfo = title === eventTitle
          && zoo === eventZoo
          && startTime.toISOString() === eventStart;

        return sameScheduleId || sameEventInfo;
      });
    }

    return false;
  }, [title, scheduleId, scheduledEvents, startTime, zoo]);

  const buttonText = useMemo(() => {
    let text = 'Learn More';

    if (onClick) {
      text = 'Join Now';
    } else if (isReminder) {
      text = isReminded ? 'Email Sent' : 'Remind Me';
    }

    return text;
  }, [onClick, isReminder, isReminded]);

  useEffect(() => {
    if (error) {
      console.error("Error sending an email", error);
    } else if (data && data.user) {
      setUserDataAction(data.user);
    }
  }, [error, data, setUserDataAction]);

  const onClickHandler = (id) => async () => {
    if (onClick) {
      onClick();
    } else if (isReminder) {
      await post({ scheduleId: id });
    } else {
      showScheduleModalAction(id, startTime);
    }
  }

  return (
    <div className={classnames(style.card, { [style.loading]: loading })}>
      <div className={style.wrapper}>
        <div className={style.left}>
          <div className={classnames(style.header, { shimmer: loading })}>{header}</div>
          <div className={classnames(style.title, { shimmer: loading })}>{title}</div>
          <div className={classnames(style.description, { shimmer: loading })}>
            {description && (description.length < 48 ? description : `${description.slice(0, 45).trim()}...`)}
          </div>
        </div>
        <div className={style.right}>
          <img src={image} className={classnames({ shimmer: loading })} alt="" />
          {!isLocked && (
            <PrimaryButton
              onClick={onClickHandler(scheduleId)}
              disabled={isReminder && isReminded}
              className={classnames({ shimmer: loading })}
              size="small"
              label={buttonText}
              margin={{top: '10px'}}
              loading={sendingReminder && !loading}
            />

          )}
          {isLocked && (
            <Link href={encodeURI(`/plans`)}>
              <Button
                primary
                label={(
                  <Box direction="row" justify="center" align="center">
                    <FontAwesomeIcon icon={faLockAlt} color="#2E2D2D" size="1x" />
                    <Text className={style.buttonText}>Unlock</Text>
                  </Box>
                )}
                size="large"
                className={style.lockButton}
                style={{ width: '80px'}}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(
  (
    { user: { scheduledEvents, subscription: { productId, freeHabitat } } },
  ) => (
    { scheduledEvents, productId, freeHabitat }
  ),
  {
    setUserDataAction: setUserData,
    showScheduleModalAction: showScheduleModal,
  },
)(Card);
