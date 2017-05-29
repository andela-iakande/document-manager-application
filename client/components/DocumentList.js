import React, { PropTypes } from 'react';
import {Modal, Button, Row, Input, Pagination} from 'react-materialize';
import moment from 'moment';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import DocumentTitle from '../components/DocumentListTitle';
import DocumentContent from '../components/DocumentContent';
import  * as DocumentAction from '../actions/DocumentActions';
import Search from '../components/SearchDocument';
import imagePath from '../img/cardReveal.jpg';
import renderHTML from 'react-render-html';
import TinyMCE from 'react-tinymce';
import Prompt from '../components/Prompt';

/**
 * 
 * 
 * @class DocumentList
 * @extends {React.Component}
 */
class DocumentList extends React.Component{
  constructor (props) {
    super(props);
    const { updateDocument } = this.props;
    const { deleteDocument } = this.props;
    const { fetchDocuments } = this.props;
    this.state = {
    id: '',
    title: '',
    content: '',
    access: 'public',
    authorId: '',
  };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  /**
   * 
   * 
   * @param {any} e 
   * @returns 
   * 
   * @memberOf DocumentList
   */
  fieldChange(e) {
      return this.setState({ [e.target.name]: e.target.value,  })
    }

  /**
   * 
   * 
   * @param {any} event 
   * 
   * @memberOf DocumentList
   */
  onChange(event) {
  this.setState({
    [event.target.name]: event.target.value
  });
  } 

  /**
   * 
   * 
   * @param {any} e 
   * 
   * @memberOf DocumentList
   */
  handleEditorChange(e) {
    this.setState({ content: e.target.getContent() });
  }
 
  /**
   * 
   * 
   * @param {any} event 
   * 
   * @memberOf DocumentList
   */
  onClick(event) {
  event.preventDefault();
  this.props.deleteDocument(this.props.role.id).then(() => {
    Materialize.toast('Document successfully deleted.', 5000);
  });
  }
 
  /**
   * 
   * 
   * @param {any} id 
   * 
   * @memberOf DocumentList
   */
  deleteDoc (id) {
      this.props.deleteDocument(id);
   }

  /**
   * 
   * 
   * @param {any} pageNo 
   * 
   * @memberOf DocumentList
   */
  onSelect(pageNo){
    const offset = (pageNo-1) * 10;
    this.props.fetchDocuments(offset);
   }

  /**
   * 
   * 
   * @param {any} e 
   * @param {any} id 
   * 
   * @memberOf DocumentList
   */
  onSubmit(e, id){
  e.preventDefault();
    const title = e.target.title.value;
    const access = e.target.access.value;
    const content = this.state.content;
    const documentDetails = { id, title, access, content };
    this.props.updateDocument(documentDetails);
   }
  
  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf DocumentList
   */
  render () {
    let pagination = null;
    let doc = null;
    if (this.props.documentDetails.documents && 
      this.props.documentDetails.documents.rows) {
        doc = this.props.documentDetails.documents.rows;
        pagination = this.props.documentDetails.pagination;
    }

    return (
    <div>
      { doc ?
        <div className="row">
        {doc.map(document =>
          <div key={document.id}>
              <div className="col s3">
                <div className="card white darken-1 activator"  
                style={{ height: 185,backgroundImage: 'url(' + imagePath + ')' 
                }}>
                <div className="card-image waves-effect waves-block waves-light">
                  <a className = "btn activator">VIEW</a>
                </div>
                
          <div className="card-reveal black-text">
              <DocumentTitle title={document.title} />
              <DocumentContent content={renderHTML(document.content)} />
          </div>

          <div className="card-action">
              <div className>{document.title}</div>
              <strong><div className = "right">{document.access}</div>
              </strong>
              <a>Published: {moment(document.createdAt).format('MMMM Do YYYY')}
              </a> <br/>
                
              <div className="card-action">
                <Modal
                  header='Edit Document'
                  trigger={
                  <Button modal = 'close' waves='light' 
                  className="btn-floating btn-large teal darken-2 right">
                  <i className="large material-icons">mode_edit</i></Button>
                  }>
                <form className="col s12" method="post" onSubmit={(e) => 
                  this.onSubmit(e, document.id)} >
      
                <Row>
                <Input s={6} name = "title" defaultValue={document.title}
                 onChange={(e) => this.fieldChange(e)}  />
                  <Input  s={6} name = "access" validate type = "select" 
                  value={this.state.access === '' ? document.access : 
                  this.state.access} onChange={(e) => this.fieldChange(e)}> 
                  <option value="public">Public</option>
                  <option value="private">Private</option> 
                </Input>
                </Row>

                <Row>
                  <TinyMCE
                    content={document.content}
                    config={{
                      plugins: 'link image preview',
                      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'
                    }}
                  onChange={this.handleEditorChange}
                  />
                </Row>

              <Button modal ='close' className="teal darken-2" waves='light' 
              type="submit">UPDATE</Button>
                </form>
                </Modal>
                <Prompt
                  trigger={
                    <Button waves='light' 
                    className="btn-floating btn-large red darken-2 right">
                      <i className="large material-icons">delete</i>
                    </Button>
                  }

                onClickFunction={
                  (e) => {this.deleteDoc(document.id)}
                }
                />
              </div>
              <Modal
                header= {document.title}
                trigger={
                  <Button waves='light'>READ MORE</Button>
                }>
                 <DocumentContent content={renderHTML(document.content)} />
              </Modal>
              </div>
            </div>
          </div>
        </div>
        )}
       {pagination ? <Pagination items={pagination.page_count} 
       activePage={2} maxButtons={5} onSelect={(e)=>this.onSelect(e)}/> : ''}
      </div>
      : <div>No document</div> }
      </div>
  );
};
  }

const mapDispatchToProps = dispatch => ({
  updateDocument: documentDetails => dispatch(DocumentAction.
  updateDocument(documentDetails)),
  deleteDocument: id => dispatch(DocumentAction.deleteDocument(id)),
  fetchDocuments: offset => dispatch(DocumentAction.fetchDocuments(offset))
});

const mapStateToProps = (state) => {
  return {
    documentDetails: state.documents
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList);

