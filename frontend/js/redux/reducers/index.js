import { combineReducers } from 'redux';

import authReducer from './authReducer';
import commitReducer from './commitReducer';
import repoReducer from './repoReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  commit: commitReducer,
  repo: repoReducer,
});

export default rootReducer;
