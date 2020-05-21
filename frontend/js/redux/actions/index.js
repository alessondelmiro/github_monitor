import authActions from './authActions';
import repoActions from './repoActions';

const actions = {
  ...authActions,
  ...repoActions,
};

export default actions;
