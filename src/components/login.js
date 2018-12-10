import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import store from "../store";
import {LOG_IN_ACTION} from "../store/action";
import * as path from "../path";
// import "../styles/login.css";

/**
    @typedef {{
        me : undefined|import("../store").Me,
        errorMessages : import("../store").ErrorMessageCollection,
    }} LogInProps
    @typedef {import("../store/action").LogInArgs} LogInState

    @extends {Component<LogInProps, LogInState>}
*/
class Login extends Component {
    /**
        @param {LogInProps} props
    */
    constructor(props){
        super(props);

        /**
            @type {LogInState}
        */
        this.state = {
            emailAddress : "",
            password : ""
        };
    }

    login = () => {
        if (
            this.state.emailAddress !== "" &&
            this.state.password !== ""
        ) {
            store.dispatch(LOG_IN_ACTION(this.state));
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
        }
    };

    render() {
        if (this.props.me !== undefined) {
            return (<Redirect to={path.nearby}/>);
        }

        return (
            <div id="Body">
                <div className="medium-5 columns left">
                <h1><b><i>MUNCH MATCH</i></b></h1>
            <h3 style={{fontWeight: 300, letterSpacing: "2px"}}>Welcome</h3>
            <h4>Login</h4>
                <label>Username</label>
                <input type="text" name="emailAddress" placeholder="Email Address" onChange={this.onChange}/>
                <label>Password</label>
                <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/>
                <input type="submit" className="button success" value="Login" onClick={this.login}/>
                <a href="/register">Registration</a>
                </div>
                {this.props.errorMessages.logIn}
            </div>
        );
    }
}

/**
    @param {import("../store").State} state
    @returns {LogInProps}
*/
function mapStateToProps (state) {
    return {
        me: state.me,
        errorMessages : state.errorMessages,
    };
};
export default connect(mapStateToProps)(Login);
