import request from 'superagent';
import jwtDecode from 'jwt-decode';
import {
  browserHistory
} from 'react-router';
import * as types from './ActionTypes';
import setCurrentUser from './AuthAction';
import getToken from '../actions/GetToken';

/**
 * createUser,
 * action dispatched on getting a user records from db
 * @param  {object} user user response fron api call in the thunk
 * @return {object}      reponse dispatched to reducer
 */
export const createUser = user => ({
  type: types.CREATE_USER,
  user
});

/**
 *  action dispatched on creating new user failure
 *
 * @export
 * @param {any} user
 * @returns {Object} json object
 */
export const getUserSuccess = user => ({
  type: types.USER_SUCCESS,
  user
});

/**
 * action dispatched on creating new user success
 *
 * @export
 * @param {any} user
 * @returns {Object} json object
 */
export const createUserSuccess = user => ({
  type: types.CREATE_USER_SUCCESS,
  user
});
/**
 * update user success
 * @param  {object} user updated user new details
 *  @param  {object} userId
 * @return {object} json object
 */
export const updateUserSuccess = (user, userId) => ({
  type: types.UPDATE_USER_SUCCESS,
  user,
  userId
});

/**
 * remove from state the currently selected user
 * @param  {object} user delete user details
 * @return {object} action [description]
 */
export const deleteUserSuccess = user => ({
  type: types.DELETE_USER_SUCCESS,
  user
});

/**
 * create new user using api route
 * POST /users/
 *
 * @export saveUser
 * @param {object} user
 * @returns {Object} api response
 */
export const saveUser = user => (dispatch) => {
  request
    .post('/api/users')
    .send(user)
    .end((err, res) => {
      Materialize.toast(res.body.message, 4000, 'rounded');
      if (err) {
        return err;
      }
      dispatch(createUserSuccess(user));
      browserHistory.push('/login');
    });
};
/**
 * load users from the database using api route setting limit and offset
 * GET /users/?limit=%offset=
 * @param  {number} limit  [description]
 * @param  {number} offset [description]
 * @return {object}        [description]
 */
export const fetchAllUsers = offset =>
  dispatch => new Promise((resolve) => {
    request
      .get(`/api/users?offset=${offset}`)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        dispatch(getUserSuccess(res.body));
        resolve();
      });
  });


/**
 * login user function
 * set user token to local storage on successfull login
 * and set headers for authorization
 *
 * @export
 * @param {any} user
 * @returns {any} data
 */
export const login = (userCredentials) => 
  dispatch => {
    request
      .post('/api/users/login')
      .send(userCredentials)
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        if (err) {
          return err;
        }
        Object.assign({}, res.body.user, {
          token: res.body.token
        });
        localStorage.setItem('dms-user', res.body.token);
        browserHistory.push('/');
        dispatch(setCurrentUser(jwtDecode(res.body.token)));
      });
  };


export const editUser = (userId, userData) => {
  return (dispatch) => {
    request
      .put(`/api/users/${userId}`, userData)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        dispatch(setCurrentUser(userData));
      });
  };
};

/**
 *
 *
 * @export
 * @param {any} userId
 * @returns {Object} userData
 */
export const fetchProfile = (userId) => {
  return dispatch => new Promise((resolve) => {
    request
      .get(`/api/users/${userId}`)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        if (err) {
          return err;
        }
        dispatch(setCurrentUser(res.body.user));
        resolve();
      });
  });
};

/**
 * user update by account owner
 * GET /users/:id
 * @param  {object} user [user data object to update]
 * @param  {number} userId   user id
 * @return {object}      [api response]
 */
export const updateUser = (user, userId) =>
  (dispatch) => {
    request
      .put(`/api/users/${userId}`)
      .set({
        'x-access-token': getToken()
      })
      .send(user)
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        if (err) {
          return err;
        }
        browserHistory.push('/users');
        dispatch(updateUserSuccess(res.body.updatedUser, userId));
      });
  };


/**
 *
 *
 * @export getUser
 * @param {any} id
 * @returns {Object} json object
 */
export const deleteUser = (id) => {
  return (dispatch) => {
    request
      .delete(`/api/users/${id}`)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        if (err) {
          return err;
        }
        dispatch(deleteUserSuccess(res.body.document));
      });
  };
};
