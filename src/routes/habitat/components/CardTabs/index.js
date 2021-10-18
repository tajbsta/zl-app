import { h } from 'preact';
import { connect } from 'react-redux';
import { Box } from 'grommet';
import { useEffect, useRef, useCallback } from 'preact/hooks';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';

import {
  CALENDAR,
  SCHEDULES,
  ALBUM,
  QUESTIONS,
} from './constants';

import Cards from './cards';
import CalendarLoader from './Calendar/CalendarLoader';
import Schedules from '../Schedules';
import Album from '../Album';
import Questions from '../Questions';

import { useOnScreen } from '../../../../hooks';
import { setUserData } from '../../../../redux/actions';

const renderActive = (activeTab) => {
  switch (activeTab) {
    case CALENDAR: {
      return (
        <Box pad={{ vertical: '35px' }}>
          <CalendarLoader />
        </Box>
      );
    }

    case SCHEDULES: {
      return <Schedules />;
    }

    case ALBUM: {
      return <Album />;
    }

    case QUESTIONS: {
      return <Questions />;
    }

    default: {
      return <Cards />;
    }
  }
}
const CardTabs = ({ activeTab, showContentExplorer, setUserDataAction }) => {
  const elementRef = useRef(null);
  const onScreen = useOnScreen(elementRef, '-20px');

  const { post, data } = useFetch(buildURL('/users/set-content-explorer'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const markContentAsViewed = useCallback(() => post(), [post]);

  useEffect(() => {
    // This will ignore the first trigger, since this element will appear on screen as default.
    if (onScreen && showContentExplorer) {
      markContentAsViewed();
    }
  }, [onScreen, showContentExplorer, markContentAsViewed])

  useEffect(() => {
    if (data && data.user) {
      setUserDataAction(data.user);
    }
  }, [data, setUserDataAction]);

  return (
    <Box ref={elementRef} id="cardsSection" fill>
      {renderActive(activeTab)}
    </Box>
  );
};

export default connect((
  { habitat: { cards: { activeTab } }, user: { showContentExplorer } },
) => (
  { activeTab, showContentExplorer }
), {
  setUserDataAction: setUserData,
})(CardTabs);
