import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Query from './components/query';
import Stories from './components/stories';
import Accepted from './components/accepted';
import Unaccepted from './components/unaccepted';
import Store from './store/store';
import async from './hoc/async';
import * as actions from './store/actions/app.actions';
import './App.css';

const AsyncQuery = async(
	() => {
		return import('./components/query');
	}
);

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			authenticated: false
		}
	}
	
	componentDidMount() {	
		
		Store.subscribe(
			() => {
				const updatedState = Store.getState().app;

				this.setState(
					{
						...this.state,
						authenticated: updatedState.authenticated
					}
				);
			}
		);
	}

	logout = () => {
		Store.dispatch(actions.LOGOUT_ACTION());
	}

	render() {
		return (
			<BrowserRouter /* basename=''*/>
				<div>
					{ this.state.authenticated?
						<div>
							<nav className="navbar navbar-expand-lg navbar-light bg-light">
								<h3 style={{marginLeft: '50px'}}>Munch Match</h3>
								<div>
								<ul className="navbar-nav mr-auto">
									<li className="nav-item active">
										<Link to="/query">Find Restaurant</Link>
									</li>
									<li className="nav-item active">
										<Link to="/stories">My Matches</Link>
									</li>
									<li className="nav-item active">
										<button type="button" className="btn btn-outline-primary" style={{marginLeft: '700px', marginRight: '50px'}} onClick={ this.logout }>Log Out</button>
									</li>
								</ul>
								</div>
							</nav>
						</div> : null
					}
					<Switch>
						<Route path='/login' exact component={ Login } />
						<Route path='/register' exact component={ Register } />
						{ this.state.authenticated? <Route path='/query' component={ AsyncQuery } /> : null }
						{ this.state.authenticated? <Route path='/stories' component={ Stories } /> : null }
						<Route path='/accepted' component={ Accepted } />
						<Route path='/unaccepted' component={ Unaccepted } />
						<Redirect from='/' to='/login'/>
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
