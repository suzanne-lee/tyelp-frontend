import React, { Component } from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
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

    render() {
        return (
            <div className="container">
                <form className="card" onSubmit={(e) => {
                    e.preventDefault();
                    this.register();
                }}>
                    <div className="card-body">
                        <h5 className="card-title">Register</h5>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="text" className="form-control" placeholder="Email Address" onChange={(e) => {
                                this.setState({
                                    emailAddress : e.target.value,
                                });
                            }}/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Password" onChange={(e) => {
                                this.setState({
                                    password : e.target.value,
                                });
                            }}/>
                        </div>
                        <div className="form-group">
                            <label>Display Name</label>
                            <input type="text" className="form-control" placeholder="Display Name" onChange={(e) => {
                                this.setState({
                                    displayName : e.target.value,
                                });
                            }}/>
                        </div>
                        <div>
                            <small>
                                Already have an account?
                                Click <Link to={path.logIn}>here</Link> to log in!
                            </small>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                        <br/>
                        <br/>
                        {
                            this.props.errorMessages.register === undefined ?
                            null :
                            <div className="alert alert-danger" role="alert">
                                {this.props.errorMessages.register}
                            </div>
                        }
                    </div>
                </form>
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
