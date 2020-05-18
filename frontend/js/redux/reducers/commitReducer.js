import { GET_COMMITS_PROGRESS, GET_COMMITS_SUCCESS, GET_COMMITS_FAIL } from '../types';

const initialState = {
  commits: [],
  loading: false,
  error: null,
};

// eslint-disable-next-line default-param-last
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMITS_PROGRESS:
      return {
        loading: true,
        error: null,
        commits: [],
      };
    case GET_COMMITS_SUCCESS:
      return {
        loading: false,
        error: null,
        commits: action.commits,
      };
    case GET_COMMITS_FAIL:
      return {
        loading: false,
        error: action.error,
        commits: [],
      };
    default:
      return state;
  }
};

export default reducer;
