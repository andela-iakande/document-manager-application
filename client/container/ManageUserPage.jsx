import { browserHistory } from 'react-router';
import React from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import * as userAction from '../actions/UserAction';
import UserForm from '../components/user/UserForm';

/**
 *
 *
 * @class ManageUserPage
 * @extends {React.Component}
 */
class ManageUserPage extends React.Component {

  /**
   * Creates an instance of ManageUserPage.
   * @param {any} props
   * @param {any} context
   * @memberOf ManageUserPage
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: Object.assign({}, this.props.user),
      errors: {},
      saving: false
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  /**
   *
   *
   * @param {any} event
   *@returns {any} any
   * @memberOf ManageUserPage
   */
  updateUserState(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({ user });
  }

  /**
   *
   *@param {any} event
   *@returns {any} any
   *
   * @memberOf ManageUserPage
   */
  saveUser(event) {
    event.preventDefault();
    this.props.saveUser(this.state.user);
    browserHistory.push('/');
    this.setState({ saving: true });
    toastr.success('User saved');
  }

  /**
   *
   *
   * @returns{object} object
   *
   * @memberOf ManageUserPage
   */
  render() {
    return (
      <div>
        <UserForm
          user={this.state.user}
          onChange={this.updateUserState}
          onSave={this.saveUser}
          error={this.state.error}
        />
      </div>
    );
  }
}
ManageUserPage.propTypes = {
  user: React.PropTypes.func.isRequired,
  saveUser: React.PropTypes.func.isRequired,
};

/**
 *
 * @param {any} dispatch
 * @returns {any} any
 */
const mapDispatchToProps = dispatch => ({
  saveUser: user => dispatch(userAction.saveUser(user)),
  fetchUsers: () => dispatch(userAction.fetchUsers())
});

/**
 *
 * dispatch user actions
 * @param {any} state
 * @returns {any} any
 */
const mapStateToProps = () => {
  const user = { firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    roleId: '' };
  return {
    user
  };
};
export { ManageUserPage };
export default connect(mapStateToProps, mapDispatchToProps)(ManageUserPage);
