import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {BrowserRouter, Switch, Route, Link, withRouter} from "react-router-dom";
import LogIn from "./components/log-in";
import Register from "./components/register";
import Matches from "./components/matches";
import store from "./store";
import async from "./hoc/async";
import * as actions from "./store/action";
import "./App.css";
import * as path from "./path";

const AsyncQuery = async(
    () => {
        return import("./components/nearby");
    }
);

const LoggedOutNavBar = withRouter(props => {
    const pathname = props.location.pathname;
    /** @param {string} desired */
    const setActive = (desired) => {
        return pathname === desired ? "active" : ""
    };
    return <ul className="navbar-nav ml-auto">
        <li className={`nav-item ${setActive(path.logIn)}`}>
            <Link className="nav-link" to={path.logIn}>Log In</Link>
        </li>
        <li className={`nav-item ${setActive(path.register)}`}>
            <Link className="nav-link" to={path.register}>Register</Link>
        </li>
    </ul>
});
const LoggedInNavBar = withRouter(props => {
    const pathname = props.location.pathname;
    /** @param {string} desired */
    const setActive = (desired) => {
        return pathname === desired ? "active" : ""
    };
    return <ul className="navbar-nav ml-auto">
        <li className={`nav-item ${setActive(path.nearby)}`}>
            <Link className="nav-link" to={path.nearby}>Restaurants Near Me</Link>
        </li>
        <li className={`nav-item ${setActive(path.match)}`}>
            <Link className="nav-link" to={path.match}>My Matches</Link>
        </li>
        <li className={`nav-item`}>
            <a className="nav-link" href="/#" onClick={
                props.onLogOut
            }>Log Out</a>
        </li>
    </ul>
});

/**
    @typedef {{ me : undefined|import("./store").Me }} AppProps
    @typedef {{}} AppState

    @extends {Component<AppProps, AppState>}
*/
class App extends Component {
    logOut = () => {
        store.dispatch(actions.LOG_OUT_ACTION_SUCCESS());
    }

    renderLoggedOutRoutes () {
        return (
            <Switch>
                <Route path={path.logIn} exact component={LogIn} />
                <Route path={path.register} exact component={Register} />
                <Route path={"/"} component={() => <Redirect to={path.logIn}/>} />
            </Switch>
        );
    }
    renderLoggedInRoutes () {
        return (
            <Switch>
                <Route path={path.nearby} component={AsyncQuery} />
                <Route path={path.match} component={Matches} />
                <Route path={"/"} component={() => <Redirect to={path.nearby}/>} />
            </Switch>
        );
    }
	render() {
        const loggedIn = this.props.me !== undefined;
        return (
            <BrowserRouter>
                <div>
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                        <Link className="navbar-brand" to={path.root}>
                            <h5 style={{ lineHeight : "1.0" }}>
                                <b><i>MUNCH MATCH</i></b>
                                {
                                    this.props.me === undefined ?
                                    null :
                                    <div style={{ fontSize : "60%" }}>
                                        Hello, {this.props.me.displayName}!
                                    </div>
                                }

                            </h5>
                        </Link>
                        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                            {loggedIn ? <LoggedInNavBar onLogOut={this.logOut}/> : <LoggedOutNavBar/>}
                        </div>
                    </nav>
                    {
                        loggedIn ?
                        this.renderLoggedInRoutes() :
                        this.renderLoggedOutRoutes()
                    }
                </div>
            </BrowserRouter>
        );
    }
}

/**
    @param {import("./store").State} state
    @returns {AppProps}
*/
function mapStateToProps (state) {
    return {
        me: state.me,
    };
};
export default connect(mapStateToProps)(App);
