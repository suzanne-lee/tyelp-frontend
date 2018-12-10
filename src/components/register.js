import React, { Component } from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import store from "../store";
import {REGISTER_ACTION} from "../store/action";
import * as path from "../path";
// import '../styles/login.css';

/**
    @typedef {{
        me : undefined|import("../store").Me,
        errorMessages : import("../store").ErrorMessageCollection,
    }} RegisterProps
    @typedef {import("../store/action").RegisterArgs} RegisterState

    @extends {Component<RegisterProps, RegisterState>}
*/
class Register extends Component {
    /** @param {RegisterProps} props */
    constructor(props) {
        super(props);

        /** @type {RegisterState} */
        this.state = {
            emailAddress: "",
            password: "",
            displayName: "",
        };
    }

    register = () => {
        if (
            this.state.emailAddress !== "" &&
            this.state.password !== "" &&
            this.state.displayName !== ""
        ) {
            store.dispatch(REGISTER_ACTION(this.state));
        }
    };

    /**
        @param {{
            target : {
                name : string,
                value : string,
            }
        }} e
    */
    onChange = (e) => {
        const name = e.target.name;
        if (name === "emailAddress") {
            this.setState({
                emailAddress : e.target.value,
            });
        } else if (name === "password") {
            this.setState({
                password : e.target.value,
            });
        } else if (name === "displayName") {
            this.setState({
                displayName : e.target.value,
            });
        }
    };

    render() {
        if (this.props.me !== undefined) {
            return (<Redirect to={path.nearby}/>)
        }



        return (
            <div className="row " id="Body">
                <div className="medium-5 columns left">
                <h4>Register</h4>
                <label>Email</label>
                <input type="text" name="emailAddress"  placeholder="Email Address" onChange={this.onChange}/>
                <label>Password</label>
                <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/>
                <label>Display Name</label>
                <input type="text" name="displayName"  placeholder="Display Name" onChange={this.onChange}/>

                <input type="submit" className="button success" value="Register" onClick={this.register}/>
                <a href={path.logIn}>Login</a>
                {this.props.errorMessages.register}
                </div>
            </div>
        );
    }
}

/**
    @param {import("../store").State} state
    @returns {RegisterProps}
*/
function mapStateToProps (state) {
    return {
        me: state.me,
        errorMessages : state.errorMessages,
    };
};
export default connect(mapStateToProps)(Register);
