import expect from 'expect';
import {
  CREATE_DOCUMENT_SUCCESS,
  LOAD_DOCUMENT_SUCCESS,

} from '../../actions/ActionTypes';


import reducer from '../../reducers/DocumentReducer';

describe('documents reducer', () => {
  const testDocuments = {
    rows: [
      {
        title: 'title one',
        access: 'public',
        id: 1
      },
      {
        title: 'title two',
        access: 'private',
        id: 2
      }
    ],
    count: 2,
    metaData: {
      currentPage: 1,
      pageSize: 1,
      pages: 1,
      totalCount: 2
    },
  };
  // it('should return the initial state', () => {
  //   expect(reducer())
  //   .toEqual({
  //     documents: [],
  //   });
  it('should handle GET_DOCUMENTS_SUCCESS', () => {
    expect(reducer([], {
      type: LOAD_DOCUMENT_SUCCESS,
      documents: {
        rows: [],
        count: 0
      },
    }))
    .toEqual({ count: 0, rows: [] });
  });

  it('should handle CREATE_DOCUMENT', () => {
    expect(reducer([], {
      type: CREATE_DOCUMENT_SUCCESS,
      document: {
        rows: [],
        count: 0
      },
    }))
    .toEqual([{ count: 0, rows: [] }]);
  });
});
