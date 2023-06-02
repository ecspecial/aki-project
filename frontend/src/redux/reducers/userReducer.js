import * as types from '../constants/actionTypes';

const initialState = {
  user: null,
  token: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER:
      return {
        ...state,
        user: action.user,
        token: action.token
      };
    default:
      return state;
  }
};

export default userReducer;