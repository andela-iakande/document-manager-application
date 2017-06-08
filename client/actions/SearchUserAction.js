import request from 'superagent';
import { SEARCH_RESULTS } from './Types';
import { fetchAllUsers } from './DocumentActions';
import * as types from './ActionTypes';

import getToken from '../actions/GetToken';

/**
 * userSearchResult
 * @param  {object} userSearchResult user reponse from api call
 * @return {object}      action type and action payload
 */
export function usersSearched(userSearchResult) {
  return { type: SEARCH_RESULTS, payload: userSearchResult };
}

/**
 * createUser,
 * action dispatched on getting a user records from db
 * @param  {object} users user response fron api call in the thunk
 * @return {object}      reponse dispatched to reducer
 */
export const getUserSuccess = user => ({ type: types.USER_SUCCESS, user });

/**
 * search user function,
 * GET /search/users/?term={queryString}
 * @param  {String} queryString search term
 * @param  {number} limit  limit of records to be returned
 * @param  {numebr} offset offset of user data
 * @return {object}        reponse from the api
 */
export function searchUsers(queryString, offset = 0) {
  return (dispatch) => {
    request.get(`/api/search/users/?q=${queryString}&offset=${offset}`)
.set({ 'x-access-token': getToken() }).end((err, res) => {
  if (queryString) {
    dispatch(getUserSuccess(res.body));
  } else {
    dispatch(fetchAllUsers());
  }
});
  };
}
