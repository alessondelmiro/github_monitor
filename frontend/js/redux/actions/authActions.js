import axios from 'axios';

import { AUTH_CHECKING, AUTH_FAIL, AUTH_SUCCESS } from '../types';

async function setToken(token) {
  axios.defaults.headers.common.Authorization = `Token ${token}`;
}

const checkUser = (token) => {
  return async (dispatch) => {
    if (token) {
      dispatch({ type: AUTH_CHECKING });
      try {
        const response = await axios.get(`/api/verify?token=${token}`);
        if (response.status === 204) {
          await setToken(token);
          dispatch({ type: AUTH_SUCCESS });
          return true;
        }
        dispatch({
          type: AUTH_FAIL,
          error: {
            message: 'User not valid.',
          },
        });
        return false;
      } catch (error) {
        dispatch({ type: AUTH_FAIL, error });
      }
    }
    return false;
  };
};

const authActions = {
  checkUser,
};

export default authActions;
