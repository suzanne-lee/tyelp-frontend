import React, {Component} from "react";
import {connect} from "react-redux";
import store from "../store";
import {LOG_IN_ACTION} from "../store/action";
import * as path from "../path";
// import "../styles/login.css";
import {Link} from "react-router-dom";

/**
    @typedef {{
        me : undefined|import("../store").Me,
        errorMessages : import("../store").ErrorMessageCollection,
    }} LogInProps
    @typedef {import("../store/action").LogInArgs} LogInState

    @extends {Component<LogInProps, LogInState>}
*/
class LogIn extends Component {
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

    logIn = () => {
        if (
            this.state.emailAddress !== "" &&
            this.state.password !== ""
        ) {
            store.dispatch(LOG_IN_ACTION(this.state));
        }
    };

    render() {
        return (
            <div className="container">
                <form className="card" onSubmit={(e) => {
                    e.preventDefault();
                    this.logIn();
                }}>
                    <div className="card-body">
                        <h5 className="card-title">Log In</h5>
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
                        <div>
                            <small>
                                Don't have an account?
                                Click <Link to={path.register}>here</Link> to register!
                            </small>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Log In
                        </button>
                        <br/>
                        <br/>
                        {
                            this.props.errorMessages.logIn === undefined ?
                            null :
                            <div className="alert alert-danger" role="alert">
                                {this.props.errorMessages.logIn}
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
    @returns {LogInProps}
*/
function mapStateToProps (state) {
    return {
        me: state.me,
        errorMessages : state.errorMessages,
    };
};
export default connect(mapStateToProps)(LogIn);
