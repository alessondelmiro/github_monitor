import axios from 'axios';
import moment from 'moment';

import { REPO_PROGRESS, REPO_SUCCESS, REPO_FAIL, HAS_REPOS, NO_REPOS } from '../types';

const createRepo = (name) => (dispatch) => {
  dispatch({ type: REPO_PROGRESS });
  if (!name.includes('/')) {
    dispatch({
      type: REPO_FAIL,
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
          type: REPO_SUCCESS,
          repository: response.data,
          alertMsg,
          success: { detail: `Repository ${response.data.name} added`, created: moment() },
        });
      }
      return null;
    })
    .catch((error) => {
      dispatch({ type: REPO_FAIL, error: error.response.data });
    });
  return null;
};

const checkRepos = () => (dispatch) => {
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
  // ?page=${page}
  dispatch({ type: REPO_PROGRESS });
  axios
    .get(`/api/repositories/${id}`)
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: REPO_SUCCESS, repository: response.data });
      }
      return null;
    })
    .catch((error) => {
      dispatch({ type: REPO_FAIL, error: error.response.data });
    });
};

const repoActions = {
  createRepo,
  checkRepos,
  getRepo,
};

export default repoActions;
