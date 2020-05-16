/* eslint-disable no-fallthrough */
import { AUTH_CHECKING, AUTH_FAIL, AUTH_SUCCESS } from '../types';

const initialState = {
  loading: false,
  authenticated: false,
  token: null,
  error: null,
};

const reducer = (action, state = initialState) => {
  console.log(action);
  switch (action.type) {
    case AUTH_CHECKING:
      Object.assign({}, state, {
        loading: true,
        error: null,
        authenticated: false,
        token: action.token,
      });
    case AUTH_SUCCESS:
      Object.assign({}, state, {
        loading: false,
        error: null,
        authenticated: true,
        token: action.token,
      });
    case AUTH_FAIL:
      Object.assign({}, state, {
        loading: false,
        error: action.error,
        authenticated: false,
        token: null,
      });

    default:
      return state;
  }
};

export default reducer;
