import axios from 'axios';

import { CREATE_REPO_PROGRESS, CREATE_REPO_SUCCESS, CREATE_REPO_FAIL, NO_REPOS } from '../types';

const createRepo = (name) => (dispatch) => {
  dispatch({ type: CREATE_REPO_PROGRESS });
  if (!name.includes('/')) {
    dispatch({ type: CREATE_REPO_FAIL, error: 'Wrong format. Example: username/repo_name' });
    return null;
  }
  axios
    .post('/api/repositories/?format=json', {
      name,
    })
    .then((response) => {
      if (response.status === 201) {
        dispatch({
          type: CREATE_REPO_SUCCESS,
          repository: response.data,
          success: 'Repository added, retrieving commits...',
        });
      }
      return null;
    })
    .catch((error) => {
      dispatch({ type: CREATE_REPO_FAIL, error: error.response.data.detail });
    });
  return null;
};

const checkRepos = () => (dispatch) => {
  axios.get('api/repositories/check').then((response) => {
    if (response.status !== 204) {
      dispatch({ type: NO_REPOS });
    }
    return null;
  });
};

const repoActions = {
  createRepo,
  checkRepos,
};

export default repoActions;
