/**
 * Documents action, disptach action and
 * action types of each action to the reducer
 */
import {
  browserHistory
} from 'react-router';
import request from 'superagent';
import decode from 'jwt-decode';
import * as types from './ActionTypes';

import getToken from '../actions/GetToken';


/**
 * create new document success action
 *
 * @export
 * @param {any} document newly create document reponse from api post
 * @returns {any} action and action types
 */
export const createDocument = document => ({
  type: types.CREATE_DOCUMENT,
  document
});

/**
 * getdocumentsuccess
 * @export
 * @param {any} documents  returned documents from api call
 * @returns {any} action and action types
 */
export const getDocumentSuccess = documents => ({
  type: types.LOAD_DOCUMENT_SUCCESS,
  documents
});

/**
 * getdocumentsuccess
 * @export
 * @param {any} documents  returned documents from api call
 * @returns {any} action and action types
 */
export const getOwnDocumentSuccess = documents => ({
  type: types.LOAD_OWN_DOCUMENT_SUCCESS,
  documents
});
/**
 * update documents to database using PUT api route /documents/:id
 *
 * @export
 * @param {any} document
 * @returns {object} documents
 */
export const updateDocumentSuccess = document => ({
  type: types.UPDATE_DOCUMENT_SUCCESS,
  document
});

/**
 * create new document success action
 *
 * @export
 * @param {any} document newly create document reponse from api post
 * @returns {any} action and action types
 */
export const createDocumentSuccess = document => ({
  type: types.CREATE_DOCUMENT_SUCCESS,
  document
});

/**
 * delete document from database using DELETE api route /documents/:id
 *
 * @export
 * @param {any} id
 * @returns {object} documents
 */
export const deleteDocumentSuccess = id => ({
  type: types.DELETE_DOCUMENT_SUCCESS,
  id
});

// thunk
/**
 *
 * @export
 * @param {any} offset
 * @param {any} limit
 * @returns {Object}object
 */
export const fetchDocuments = (offset) => {
  const pageOffset = offset || 0;
  // const token = localStorage.getItem('dms-user');

  return (dispatch) => {
    request
      .get(`/api/documents?offset=${pageOffset}`)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        dispatch(getDocumentSuccess(res.body));
      });
  };
};

/**
 *
 * @export
 * @param {number} [offset=0]
 * @param {number} [limit=10]
 * @returns {Object}object
 */
export const fetchOwnDocuments = () => {
  const userData = decode(getToken());
  const id = userData.userId;
  return (dispatch) => {
    request
      .get(`/api/users/${id}/documents/`)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        dispatch(getOwnDocumentSuccess(res.body.userDocuments));
      });
  };
};

export const documentSaver = (document) => {
  return (dispatch) => {
    request
      .post('/api/documents')
      .send(document)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        if (err) {
          return err;
        }
        dispatch(createDocumentSuccess(res.body.document));
        browserHistory.push('/documents');
      });
  };
};

/**
 *
 *
 * @export
 * @param {any} document
 * @returns {Object}
 */
export const updateDocument = (document) => {
  return (dispatch) => {
    request
      .put(`/api/documents/${document.id}`)
      .send(document)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        if (err) {
          return err;
        }
        dispatch(fetchOwnDocuments());
      });
  };
};

/**
 *
 *
 * @export
 * @param {any} documentId
 * @returns {Object}
 */
export const deleteDocument = (id) => {
  return (dispatch) => {
    request
      .delete(`/api/documents/${id}`)
      .set({
        'x-access-token': getToken()
      })
      .end((err, res) => {
        Materialize.toast(res.body.message, 4000, 'rounded');
        if (err) {
          return err;
        }
        dispatch(deleteDocumentSuccess(id));
      });
  };
};
