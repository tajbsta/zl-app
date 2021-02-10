import { h } from 'preact';
import { connect } from 'react-redux';

import WeatherWidget from 'Components/WeatherWidget';

import { addUserInteraction } from '../../../redux/actions';
import StreamInteractions from './StreamInteractions';
import StreamControls from './StreamControls';
import InteractiveAreaHandler from './InteractiveAreaHandler';

const StreamInteractiveArea = () => (
  <>
    <StreamControls />
    <StreamInteractions />
    <InteractiveAreaHandler />
    <WeatherWidget />
  </>
);

export default connect(null, {
  addUserInteractionAction: addUserInteraction,
})(StreamInteractiveArea);
