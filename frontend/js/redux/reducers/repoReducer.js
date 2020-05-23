import {
  REPO_PROGRESS,
  CREATE_REPO_SUCCESS,
  CREATE_REPO_FAIL,
  GET_REPO_SUCCESS,
  GET_REPO_FAIL,
  COMMITS_PROGRESS,
  GET_COMMITS_SUCCESS,
  GET_COMMITS_FAIL,
  HAS_REPOS,
  NO_REPOS,
} from '../types';

const initialState = {
  loading: false,
  error: null,
  repository: null,
  newRepo: false,
  success: null,
  hasRepos: false,
  alertMsg: null,
  commits: [],
  hasNext: true,
  loadingCommits: false,
};

// eslint-disable-next-line default-param-last
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REPO_PROGRESS:
      return {
        ...state,
        loading: true,
      };
    case COMMITS_PROGRESS:
      return {
        ...state,
        loadingCommits: true,
      };
    case CREATE_REPO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        newRepo: true,
        success: action.success,
        alertMsg: action.alertMsg,
        hasRepos: true,
      };
    case CREATE_REPO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
        newRepo: false,
        success: null,
        alertMsg: action.alertMsg,
        hasRepos: false,
      };
    case GET_REPO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        newRepo: false,
        repository: action.repository,
        commits: action.commits,
        success: action.success,
        alertMsg: action.alertMsg,
        hasNext: action.hasNext,
      };
    case GET_REPO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
        newRepo: false,
        repository: null,
        commits: [],
        success: null,
        alertMsg: action.alertMsg,
        hasNext: true,
      };
    case GET_COMMITS_SUCCESS:
      return {
        ...state,
        loadingCommits: false,
        error: null,
        commits: action.reset ? action.commits : [...state.commits, ...action.commits],
        hasNext: action.hasNext,
      };
    case GET_COMMITS_FAIL:
      return {
        ...state,
        loadingCommits: false,
        error: action.error,
        commits: [],
        hasNext: true,
      };
    case HAS_REPOS:
      return {
        ...state,
        hasRepos: true,
        newRepo: false,
        loading: false,
      };
    case NO_REPOS:
      return {
        ...state,
        hasRepos: false,
        newRepo: false,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
