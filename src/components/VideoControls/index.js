import { h } from 'preact';
import {
  useState,
  useRef,
  useEffect,
} from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import {
  Box,
  Grommet,
  RangeInput as InputRange,
  Text,
} from 'grommet';
import classnames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';
import { faVolume, faVolumeMute, faCompress } from '@fortawesome/pro-solid-svg-icons';
import RoundButton from 'Components/RoundButton';
import { PrimaryButton } from 'Components/Buttons';
import CameraSelector from 'Components/CameraSelector';

import { formatSecondsToVideoDuration } from '../../helpers';

import { useIsHabitatTabbed } from '../../hooks';

import style from './style.scss';

const customThemeRangeInputVolume = {
  global: {
    spacing: '12px',
  },
  rangeInput: {
    track: {
      height: '6px',
      extend: () => `border-radius: 10px`,
      lower: {
        color: 'white',
        opacity: 0.7,
      },
      upper: {
        color: 'white',
        opacity: 0.3,
      },
    },
    thumb: {
      color: 'white',
    },
  },
};

const customThemeRangeInputSeekbar = {
  global: {
    spacing: '12px',
  },
  rangeInput: {
    track: {
      height: '6px',
      extend: () => `border-radius: 10px`,
      lower: {
        color: '#2E2D2D',
        opacity: 0.7,
      },
      upper: {
        color: 'white',
        opacity: 0.3,
      },
    },
    thumb: {
      color: '#2E2D2D',
    },
  },
};

const VideoControls = forwardRef(({
  showControls,
  showPlayControl,
  showVolumeControl,
  showFullscreenControl,
  showSeekBar,
  showTimeStats,
  showPIPControl,
  onPauseHandler,
  isPlaying,
  isLoading,
  videoLength,
  timeElapsed,
  updateVideoTimeHandler,
  showSwitchCameraControl,
  onChangeFullscreen,
  mode = 'webrtc',
  muted = true,
  onNextHandler,
}, ref) => {
  const [showVolumeBar, setShowVolumeBar] = useState(false)
  const [isMuted, setIsMuted] = useState();
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const volumeButtonRef = useRef(null);
  const isTabbedView = useIsHabitatTabbed();

  useEffect(() => {
    setIsMuted(muted);
  }, [muted]);

  useEffect(() => {
    const handleFullscreenMode = () => {
      const isFullscreen = document.fullscreenElement
          || document.webkitCurrentFullScreenElement;
      setIsFullscreen(isFullscreen);
      onChangeFullscreen(isFullscreen);
    }

    document.addEventListener('fullscreenchange', handleFullscreenMode);
    document.addEventListener('webkitfullscreenchange', handleFullscreenMode);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenMode);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenMode);
    }
  }, [setIsFullscreen, onChangeFullscreen]);

  // TODO: we need to refactor this
  // there are a lot of references passed between different components
  // and this is receiving a reference that's not a video element
  // so the "video.play()"" is throwing errors
  const video = ref.current;

  const togglePlay = (evt) => {
    evt.stopPropagation();
    if (typeof onPauseHandler === 'function') {
      onPauseHandler();
    }
  }

  const toggleMute = (evt) => {
    evt.stopPropagation();
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  const onVolumeChange = ({ target: { value }}) => {
    video.volume = value;
    setVolume(value);
    video.muted = value === '0'
    setIsMuted(video.muted);
  };

  const openFullscreen = (evt) => {
    evt.stopPropagation();
    if (!isFullscreen) {
      video.requestFullscreen(mode);
    } else {
      video.exitFullscreen();
    }
  };

  const togglePictureInPicture = (evt) => {
    evt.stopPropagation();
    video.requestPictureInPicture();
  }

  if (!showControls || !video) {
    return null;
  }

  return (
    <Box
      className={classnames(style.videoControls, {[style.mobile]: isTabbedView})}
      direction="column"
    >
      {typeof onNextHandler === 'function' && (
      <Box direction="row" fill pad={{ vertical: 'xsmall' }} margin={{ bottom: 'small'}} justify="end">
        <PrimaryButton label="Next Video" onClick={() => onNextHandler()} />
      </Box>
      )}
      <Box direction="row" fill gap="small" align="center">
        {showPlayControl && (
          <RoundButton
          onClick={togglePlay}
          width="28"
          backgroundColor="var(--charcoal)"
          color="white"
          loading={isLoading}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </RoundButton>
        )}

        {showVolumeControl && (
          <div
          ref={volumeButtonRef}
          onMouseEnter={() => setShowVolumeBar(true)}
          onMouseLeave={() => setShowVolumeBar(false)}
          className={classnames(style.volumeWrapper, {
            [style.expanded]: showVolumeBar && !isTabbedView,
          })}
          >
            <RoundButton
              onClick={toggleMute}
              width="28"
              backgroundColor="var(--charcoal)"
              color="white"
            >
              <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolume} />
            </RoundButton>
            {!isTabbedView && showVolumeBar && volumeButtonRef.current && (
              <div
                className={classnames(style.volumeContainer, {[style.expanded]: showVolumeBar})}
              >
                <Grommet theme={customThemeRangeInputVolume} className={style.rangeInput}>
                  <InputRange
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={onVolumeChange}
                  />
                </Grommet>
              </div>
            )}
          </div>

        )}

        {showPIPControl && (
          <RoundButton
          onClick={togglePictureInPicture}
          width="28"
          backgroundColor="var(--charcoal)"
          color="white"

          >
            <FontAwesomeIcon icon={faCompress} />
          </RoundButton>
        )}

        {showFullscreenControl && (
          <RoundButton
            onClick={openFullscreen}
            width="28"
            backgroundColor="var(--charcoal)"
            color="white"
          >
            <FontAwesomeIcon icon={faExpand} />
          </RoundButton>

        )}

        {showSwitchCameraControl && (<CameraSelector />)}

        {mode === 'vod' && (
          <div className={style.timelineWrapper}>
            {showSeekBar && (
              <div className={style.seekBar}>
                <Grommet theme={customThemeRangeInputSeekbar} className={style.rangeInput}>
                  <InputRange
                    min={0}
                    max={videoLength}
                    step={1}
                    value={timeElapsed}
                    onChange={({ target: { value }}) => updateVideoTimeHandler(value)}
                  />
                </Grommet>
              </div>
            )}
            {showTimeStats && (
              <div className={style.timeStats}>
                <Text color="white" weight={700} size="large" margin={{ left: '5px' }}>
                  {`${formatSecondsToVideoDuration(timeElapsed)} / ${formatSecondsToVideoDuration(videoLength)}`}
                </Text>
              </div>
            )}
          </div>
        )}
      </Box>
    </Box>
  );
});

export default VideoControls;
