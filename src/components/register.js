import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
// import '../styles/login.css';

class Register extends Component {

    constructor(props) {
        super(props);


    this.state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        redirectToReferrer: false
    };

    this.register = this.register.bind(this);
    this.onChange = this.onChange.bind(this);

    }

    register() {
        if(this.state.username && this.state.password && this.state.email && this.state.name){
            // Talk to PHP somehow
            // this.setState({redirectToReferrer: true});
        }
    }

    onChange(e){
        this.setState({[e.target.name]:e.target.value});
    }

    render() {
        if (this.state.redirectToReferrer /*|| sessionStorage.getItem('userData')*/) {
            return (<Redirect to={'/home'}/>)
        }



        return (

            <div className="row " id="Body">
                <div className="medium-5 columns left">
                    <h4>Register</h4>
                    <label>Email</label>
                    <input type="text" name="email"  placeholder="Email" onChange={this.onChange}/>
                    <label>First Name</label>
                    <input type="text" name="firstName"  placeholder="First Name" onChange={this.onChange}/>
                    <label>Last Name</label>
                    <input type="text" name="lastName"  placeholder="Last Name" onChange={this.onChange}/>
                    <label>Password</label>
                    <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/>

                    <input type="submit" className="button" value="Register" onClick={this.register}/>
                    <a href="/login">Login</a>
                </div>

            </div>
        );
    }
}

export default Register;