import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Store from '../store/store';
import * as actions from '../store/actions/app.actions';
// import '../styles/login.css';

// This should be a container
class Login extends Component {
  constructor(){
    super();

    this.state = {
      username: '',
      password: ''
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  login() {
    if(this.state.username && this.state.password){
      Store.dispatch(actions.LOGIN_ACTION(
        this.state.username,
        this.state.password
      ));
    }
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
  }




  render() {
    if (Store.getState().app.authenticated) {
      return (<Redirect to={'/query'}/>)
    }

    return (
      <div id="Body">
        <div className="medium-5 columns left">
          <h1><b><i>MUNCH MATCH</i></b></h1>
	  <h3 style={{fontWeight: "300", letterSpacing: "2px"}}>Welcome</h3>
	  <h4>Login</h4>
          <label>Username</label>
          <input type="text" name="username" placeholder="Username" onChange={this.onChange}/>
          <label>Password</label>
          <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/>
          <input type="submit" className="button success" value="Login" onClick={this.login}/>
          <a href="/register">Registration</a>
        </div>
      </div>
    );
  }
}

/*
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
*/

export default connect(/*mapStateToProps,mapDispatchToProps*/)(Login);
