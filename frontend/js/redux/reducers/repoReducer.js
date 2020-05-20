import { REPO_PROGRESS, REPO_SUCCESS, REPO_FAIL, HAS_REPOS, NO_REPOS } from '../types';

const initialState = {
  loading: false,
  error: null,
  repository: null,
  success: null,
  hasRepos: false,
  alertMsg: null,
};

// eslint-disable-next-line default-param-last
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REPO_PROGRESS:
      return {
        ...state,
        loading: true,
      };
    case REPO_SUCCESS:
      return {
        loading: false,
        error: null,
        repository: action.repository,
        success: action.success,
        alertMsg: action.alertMsg,
        hasRepos: true,
      };
    case REPO_FAIL:
      return {
        loading: false,
        error: action.error,
        repository: null,
        success: null,
        alertMsg: action.alertMsg,
        hasRepos: true,
      };
    case HAS_REPOS:
      return {
        ...state,
        hasRepos: true,
      };
    case NO_REPOS:
      return {
        ...state,
        hasRepos: false,
      };
    default:
      return state;
  }
};

export default reducer;
