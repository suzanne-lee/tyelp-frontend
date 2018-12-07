import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Stories from './components/stories';
import Accepted from './components/accepted';
import Unaccepted from './components/unaccepted';
//import Store from './store/store';
import async from './hoc/async';
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
			user: {
				username: null,
				favorites: []
			},
			authenticated: true,
			token: null,
			restaurants: []
		}

		this.logout = this.logout.bind(this);
	}
	
	componentDidMount() {	
	}

	logout = () => {
		console.log("LOGGING OUT");
	}

	render() {
		return (
			<BrowserRouter /* basename=''*/>
				<div>
				<Link to="/query">Find Restaurant</Link>
				<Link to="/stories">My Matches</Link>
				<button onClick={ this.logout }>LogOut</button>
				<Switch>
					<Route path='/login' exact component={ Login } />
					{ this.state.authenticated? <Route path='/query' component={ AsyncQuery } /> : null }
					{ this.state.authenticated? <Route path='/stories' component={ Stories } /> : null }
					<Route path='/accepted' component={ Accepted } />
					<Route path='/unaccepted' component={ Unaccepted } />
					<Redirect from='/' to='/unaccepted'/>
				</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
