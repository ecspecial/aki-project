import * as types from '../constants/actionTypes';

export const setUser = (user, token) => {
  return {
    type: types.SET_USER,
    user,
    token
  };
};