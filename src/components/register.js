import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Store from "../store/store";
import * as actions from "../store/actions/app.actions";
// import '../styles/login.css';

class Register extends Component {

  constructor(){
    super();


    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    this.register = this.register.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  register() {
    if(this.state.username && this.state.password && this.state.firstName && this.state.lastName){
      Store.dispatch(actions.REGISTER_ACTION(
        this.state.username,
        this.state.firstName,
        this.state.lastName,
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

      <div className="row " id="Body">
        <div className="medium-5 columns left">
          <h4>Register</h4>
          <label>Email</label>
          <input type="text" name="username"  placeholder="Email" onChange={this.onChange}/>
          <label>First Name</label>
          <input type="text" name="firstName"  placeholder="First Name" onChange={this.onChange}/>
          <label>Last Name</label>
          <input type="text" name="lastName"  placeholder="Last Name" onChange={this.onChange}/>
          <label>Password</label>
          <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/>

          <input type="submit" className="button success" value="Register" onClick={this.register}/>
          <a href="/login">Login</a>
        </div>

      </div>
    );
  }
}

export default Register;