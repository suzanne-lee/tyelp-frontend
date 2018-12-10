import React, { Component } from "react";
import {connect} from "react-redux";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Stories from "./components/stories";
import Accepted from "./components/accepted";
import Unaccepted from "./components/unaccepted";
import store from "./store";
import async from "./hoc/async";
import * as actions from "./store/action";
import "./App.css";
import * as path from "./path";

const AsyncQuery = async(
    () => {
        return import("./components/query");
    }
);

/**
    @typedef {{ me : undefined|import("./store").Me }} AppProps
    @typedef {{}} AppState

    @extends {Component<AppProps, AppState>}
*/
class App extends Component {
    logout = () => {
        store.dispatch(actions.LOG_OUT_ACTION_SUCCESS());
    }

    renderLoggedOutNavigationBar () {

    }
    renderLoggedOutRoutes () {
        return (
            <Switch>
                <Route path={path.logIn} exact component={Login} />
                <Route path={path.register} exact component={Register} />
                <Route path={"/"} component={Login} />
            </Switch>
        );
    }
    renderLoggedInNavigationBar () {
        return (
            <div>
                <nav className="navbar navbar-dark bg-dark">
                    <Link className="navbar-brand" to={path.root}><h1><b><i>MUNCH MATCH</i></b></h1></Link>
                    <ul className="navbar-nav">
                        <div className="row">
                            <div className="col">
                                <li className="nav-item active">
                                    <Link to={path.nearby}>Find Restaurant</Link>
                                </li>
                            </div>
                            <div className="col">
                                <li>
                                    <Link to="/stories">My Matches</Link>
                                </li>
                            </div>
                        </div>
                    </ul>
                    <button className="btn btn-outline-primary my-2 my-sm-0"onClick={ this.logout }>Log Out</button>
                </nav>
            </div>
        );
    }
    renderLoggedInRoutes () {
        return (
            <Switch>
                <Route path={path.nearby} component={ AsyncQuery } />
                <Route path='/stories' component={ Stories } />
                <Route path='/accepted' component={ Accepted } />
                <Route path='/unaccepted' component={ Unaccepted } />
                <Route path={"/"} component={AsyncQuery} />
            </Switch>
        );
    }
	render() {
        const loggedIn = this.props.me !== undefined;
        if (loggedIn) {
            return (
                <BrowserRouter>
                    <div>
                        {this.renderLoggedInNavigationBar()}
                        {this.renderLoggedInRoutes()}
                    </div>
                </BrowserRouter>
            );
        } else {
            return (
                <BrowserRouter>
                    <div>
                        {this.renderLoggedOutNavigationBar()}
                        {this.renderLoggedOutRoutes()}
                    </div>
                </BrowserRouter>
            );
        }
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
