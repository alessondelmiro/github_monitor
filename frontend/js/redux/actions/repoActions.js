import axios from 'axios';
import moment from 'moment';

import {
  CREATE_REPO_PROGRESS,
  CREATE_REPO_SUCCESS,
  CREATE_REPO_FAIL,
  HAS_REPOS,
  NO_REPOS,
} from '../types';

const createRepo = (name) => (dispatch) => {
  dispatch({ type: CREATE_REPO_PROGRESS });
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
        dispatch({
          type: CREATE_REPO_SUCCESS,
          repository: response.data,
          success: { detail: 'Repository added, retrieving commits...', created: moment() },
        });
      }
      return null;
    })
    .catch((error) => {
      dispatch({ type: CREATE_REPO_FAIL, error: error.response.data });
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

const repoActions = {
  createRepo,
  checkRepos,
};

export default repoActions;
