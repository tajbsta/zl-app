import { h } from 'preact';
import { useState, useRef, useMemo } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { Box, Text } from 'grommet';
import { formatDistanceToNow } from 'date-fns';
import classnames from 'classnames';

import Tag from 'Components/Tag';
import Card from 'Components/Card';

import { useOnClickOutside } from '../../../../hooks';
import { useUpcomingTalks } from '../../hooks';

import style from './style.scss';

const now = new Date();

const NextTalkBar = ({ height, width }) => {
  const [expand, setExpand] = useState(false);
  const ref = useRef();
  const { loading, error, upcoming = [] } = useUpcomingTalks(null);
  const list = useMemo(
    () => upcoming.map(({ startTime, isStreamLive, ...rest }) => ({
      // TODO: we should format it to a shorter value ('days' -> 'd', 'minutes' -> 'm)
      text: startTime > now && formatDistanceToNow(startTime).replace('about ', ''),
      isLive: startTime <= now && isStreamLive,
      startTime,
      ...rest,
    })),
    [upcoming],
  );

  useOnClickOutside(ref, () => setExpand(false));

  return (
    <div ref={ref} className={style.liveTalktBar} style={{ height, width }}>
      {/* TODO: update loading and error when we get designs */}
      {loading && !error && (
        <Box fill justify="center" align="center">
          <FontAwesomeIcon size="lg" color="var(--lightGrey)" icon={faSpinner} spin />
        </Box>
      )}
      {!loading && error && (
        <Box fill justify="center" align="center">
          <FontAwesomeIcon size="lg" color="var(--pink)" icon={faTimes} />
        </Box>
      )}
      {!loading && !error && (
        <>
          <div className={classnames(style.expandBar, 'customScrollBar', {[style.active]: expand})}>
            <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
              <Text size="medium">Live Talks</Text>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className={style.listWrapper}>
              {list.map(({
                _id,
                animal,
                startTime,
                zoo,
                isLive,
                text,
                profileImage,
                description,
              }) => (
                <Card
                  key={_id}
                  scheduleId={_id}
                  animal={animal}
                  zoo={zoo}
                  startTime={startTime}
                  live={isLive}
                  header={isLive ? <Tag label="LIVE" varient="online" /> : text}
                  description={description}
                  image={profileImage}
                />
              ))}
            </div>
          </div>

          <div className={style.content}>
            <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
              <Text size="medium">Live Talks</Text>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <ul>
              {list.map(({
                _id,
                profileImage,
                text,
                isLive,
                link,
              }) => (
                <li key={_id}>
                  {/* eslint-disable-next-line no-script-url */}
                  <a href={link || 'javascript:void(0)'}>
                    <img src={profileImage} alt="" />
                    <Text size="small" weight={700}>{isLive ? <Tag label="LIVE" varient="light" /> : text}</Text>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default NextTalkBar;
