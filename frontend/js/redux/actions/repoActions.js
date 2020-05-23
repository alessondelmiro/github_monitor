import axios from 'axios';
import moment from 'moment';

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

const createRepo = (name) => (dispatch) => {
  dispatch({ type: REPO_PROGRESS });
  if (!name.includes('/')) {
    dispatch({
      type: CREATE_REPO_FAIL,
      error: { detail: 'Wrong format. Example: username/repo_name', created: moment() },
    });
    return null;
  }
  axios
    .post('/api/repositories/?format=json', {
      name,
    })
    .then((response) => {
      if (response.status === 201) {
        let alertMsg = null;
        if (response.data.commit_count === 0) {
          alertMsg = {
            detail: `Repository ${response.data.name} doesn't have any commits in the last 30 days.`,
            created: moment(),
          };
        }
        dispatch({
          type: CREATE_REPO_SUCCESS,
          alertMsg,
          success: { detail: `Repository ${response.data.name} added`, created: moment() },
        });
      }
      return null;
    })
    .catch((error) => {
      if (error.response.status === 500) {
        dispatch({
          type: CREATE_REPO_FAIL,
          error: { detail: 'Internal server error', created: moment() },
        });
        return null;
      }
      dispatch({ type: CREATE_REPO_FAIL, error: error.response.data });
      return null;
    });
  return null;
};

const checkRepos = () => (dispatch) => {
  dispatch({ type: REPO_PROGRESS });
  axios
    .get('api/repositories/check')
    .then((response) => {
      if (response.status === 204) {
        dispatch({ type: HAS_REPOS });
      }
      return null;
    })
    .catch(() => {
      dispatch({ type: NO_REPOS });
      return null;
    });
};

const getRepo = (id) => (dispatch) => {
  dispatch({ type: REPO_PROGRESS });
  axios
    .get(`/api/repositories/${id}`)
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: GET_REPO_SUCCESS,
          repository: response.data,
          commits: response.data.commit_set.results,
          hasNext: response.data.commit_set.next !== null,
        });
      }
      return null;
    })
    .catch((error) => {
      dispatch({ type: GET_REPO_FAIL, error: error.response.data });
    });
};

const getCommits = (page, repositoryId) => (dispatch) => {
  dispatch({ type: COMMITS_PROGRESS });
  const uri = repositoryId
    ? `/api/commits/?repository__id=${repositoryId}&page=${page}`
    : `/api/commits/?page=${page}`;
  axios
    .get(uri)
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: GET_COMMITS_SUCCESS,
          commits: response.data.results,
          reset: page === 1,
          hasNext: response.data.next !== null,
        });
      }
      return null;
    })
    .catch((error) => {
      dispatch({ type: GET_COMMITS_FAIL, error: error.response.data });
    });
};

const repoActions = {
  createRepo,
  checkRepos,
  getRepo,
  getCommits,
};

export default repoActions;
