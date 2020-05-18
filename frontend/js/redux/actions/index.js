import authActions from './authActions';
import commitActions from './commitActions';
import repoActions from './repoActions';

const actions = {
  ...authActions,
  ...commitActions,
  ...repoActions,
};

export default actions;
