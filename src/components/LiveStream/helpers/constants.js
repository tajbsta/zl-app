export const wsMessages = Object.freeze({
  INITIALIZED: 'initialized',
  START: 'start',
  TAKE_CANDIDATE: 'takeCandidate',
  TAKE_CONFIGURATION: 'takeConfiguration',
  STOP: 'stop',
  PLAY_PAUSED: 'play_paused',
  NOTIFICATION: 'notification',
  ERROR: 'error',
  CLOSED: 'closed',
  INITIALIZING: 'initializing',
  PLAY_STARTED: 'play_started',
  PLAY_FINISHED: 'play_finished',
  PUBLISH_STARTED: 'publish_started',
  PUBLISH_FINISHED: 'publish_finished',
  OFFLINE: 'no_stream_exist',
  STREAM_IN_USE: 'streamIdInUse',
  PUBLISH_TIMEOUT: 'publishTimeoutError',
  LOADING: 'loading',
});

export const MEDIASERVER_SOCKET_URL = process.env.PREACT_APP_MEDIASERVER_SOCKET_URL;
