import axios from 'axios';

import { AUTH_CHECKING, AUTH_FAIL, AUTH_SUCCESS } from '../types';

const authenticate = (token) => (dispatch) => {
  dispatch({ type: AUTH_SUCCESS, token });
  return { type: AUTH_SUCCESS, token };
};

const checkUser = (token) => (dispatch) => {
  dispatch({ type: AUTH_CHECKING });
  axios
    .get(`/api/verify?token=${token}`)
    .then((response) => {
      if (response.status === 204) {
        dispatch({ type: AUTH_SUCCESS, token });
        return { type: AUTH_SUCCESS, token };
      }
      dispatch({
        type: AUTH_FAIL,
        error: {
          message: 'User not validated.',
        },
      });
      return {
        type: AUTH_FAIL,
        error: {
          message: 'User not validated.',
        },
      };
    })
    .catch((error) => {
      dispatch({ type: AUTH_FAIL, error });
    });
};

const authActions = {
  authenticate,
  checkUser,
};

export default authActions;
