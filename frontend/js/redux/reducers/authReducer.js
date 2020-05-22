/* eslint-disable default-param-last */
/* eslint-disable no-fallthrough */
import { AUTH_CHECKING, AUTH_FAIL, AUTH_SUCCESS } from '../types';

const initialState = {
  loading: false,
  authenticated: false,
  error: null,
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_CHECKING:
      return {
        ...state,
        loading: true,
      };
    case AUTH_SUCCESS:
      return {
        loading: false,
        error: null,
        authenticated: true,
        user: action.user,
      };
    case AUTH_FAIL:
      return {
        loading: false,
        error: action.error,
        authenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

export default reducer;
