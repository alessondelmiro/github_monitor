/* eslint-disable default-param-last */
/* eslint-disable no-fallthrough */
import { AUTH_CHECKING, AUTH_FAIL, AUTH_SUCCESS } from '../types';

const initialState = {
  loading: false,
  authenticated: false,
  token: null,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_CHECKING:
      return {
        loading: true,
        error: null,
        authenticated: false,
        token: action.token,
      };
    case AUTH_SUCCESS:
      return {
        loading: false,
        error: null,
        authenticated: true,
        token: action.token,
      };
    case AUTH_FAIL:
      return {
        loading: false,
        error: action.error,
        authenticated: false,
        token: null,
      };

    default:
      return state;
  }
};

export default reducer;
