import axios from 'axios';

import { GET_COMMITS_PROGRESS, GET_COMMITS_SUCCESS, GET_COMMITS_FAIL } from '../types';

const getCommits = (repositoryId) => (dispatch) => {
  dispatch({ type: GET_COMMITS_PROGRESS });
  const uri = repositoryId ? `/api/commits/?repository__id=${repositoryId}` : '/api/commits/';
  axios
    .get(uri)
    .then((response) => {
      if (response.status === 200) {
        dispatch({ type: GET_COMMITS_SUCCESS, commits: response.data });
      }
      return null;
    })
    .catch((error) => {
      dispatch({ type: GET_COMMITS_FAIL, error: error.response.data.detail });
    });
};

const commitActions = {
  getCommits,
};

export default commitActions;
