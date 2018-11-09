import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions/app.actions';

class Login extends Component {
  render() {
    return (
        <div >
          Login Page
          { this.setToken }
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.app.authenticated,
    token: state.app.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setToken: () => dispatch(actions.SET_TOKEN_ACTION('aKFtu5M'))
  };
};

export default connect(null,mapDispatchToProps)(Login);
