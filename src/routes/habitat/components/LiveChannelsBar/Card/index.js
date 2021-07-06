import { route } from 'preact-router';
import { useCallback } from 'preact/hooks';
import { Box, Text } from 'grommet';
import { faArrowRight, faCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tag from 'Components/Tag';

import style from './style.scss';

const LiveHabitatCard = ({
  image,
  animal,
  habitatSlug,
  zoo,
  zooSlug,
  liveTalk,
}) => {
  const goToHabitat = useCallback(() => route(`/h/${zooSlug}/${habitatSlug}`), [habitatSlug, zooSlug]);

  return (
    <Box className={style.card} onClick={goToHabitat}>
      <Box className={style.wrapper} direction="row" align="center">
        <div className={style.image}>
          <img src={image} alt="" />
          {liveTalk && (
            <Tag
              className={style.liveTag}
              label={(
                <>
                  <FontAwesomeIcon icon={faCircle} color="black" />
                  Talk
                </>
              )}
              varient="online"
            />
          )}
        </div>
        <Box fill>
          <Text size="large" color="var(--charcoal)" margin={{ bottom: '3px' }}>
            {animal}
          </Text>
          <Text size="medium" color="var(--grey)" className={style.zooName}>
            {zoo}
          </Text>
        </Box>
        <Box pad={{ right: '10px' }}>
          <FontAwesomeIcon icon={faArrowRight} color="var(--mediumGrey)" />
        </Box>
      </Box>
    </Box>
  );
}
export default LiveHabitatCard;
