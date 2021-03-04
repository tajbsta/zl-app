import { combineReducers } from "redux";

import mainStream from './mainStream';
import user from './user';
import chat from './chat';
import habitat from '../../routes/habitat/reducer';
import plans from '../../routes/plans/reducer';
import schedule from '../../routes/schedule/reducer';
import map from '../../routes/map/reducer';
import passwordReset from '../../routes/login/ResetModal/reducer';

export default combineReducers({
  mainStream,
  user,
  chat,
  habitat,
  plans,
  map,
  schedule,
  passwordReset,
});
