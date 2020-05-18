import { CREATE_REPO_PROGRESS, CREATE_REPO_SUCCESS, CREATE_REPO_FAIL, NO_REPOS } from '../types';

const initialState = {
  loading: false,
  error: null,
  repository: null,
  success: null,
  hasRepos: true,
};

// eslint-disable-next-line default-param-last
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REPO_PROGRESS:
      return {
        loading: true,
        error: null,
        repository: null,
        success: null,
        hasRepos: true,
      };
    case CREATE_REPO_SUCCESS:
      return {
        loading: false,
        error: null,
        repository: action.repository,
        success: action.success,
        hasRepos: true,
      };
    case CREATE_REPO_FAIL:
      return {
        loading: false,
        error: action.error,
        repository: null,
        success: null,
        hasRepos: true,
      };
    case NO_REPOS:
      return {
        hasRepos: false,
      };
    default:
      return state;
  }
};

export default reducer;
