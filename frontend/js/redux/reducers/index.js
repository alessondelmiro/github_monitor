import { combineReducers } from 'redux';

import authReducer from './authReducer';
import repoReducer from './repoReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  repo: repoReducer,
});

export default rootReducer;
