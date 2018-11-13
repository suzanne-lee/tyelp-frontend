import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Query from './components/query';
import Stories from './components/stories';
import Accepted from './components/accepted';
import Unaccepted from './components/unaccepted';
import Store from './store/store';
import async from './hoc/async';
import './App.css';

const AsyncUI = async(
	() => {
		return import('./components/main_ui');
	}
);

class App extends Component {

	constructor(props) 
	{
		super(props);
		this.state = {
			user: null,
			authenticated: true,
			token: null,
			restaurants: []
		}
	}
	
	componentDidMount()
	{	
		/*
		Store.subscribe(
			() => {
				this.setState({
					...state,
					authenticated: Store.getState().app.authenticated
				});
			}
		);
		*/
	}

	render() {
		return (
		<BrowserRouter /* basename=''*/>
			<Switch>
				<Route path='/login' exact component={ Login } />
				<Route path='/register' exact component={ Register } />
				{ this.state.authenticated? <Route path='/query' component={ Query } /> : null }
				{ this.state.authenticated? <Route path='/ui' component={ AsyncUI } /> : null }
				{ this.state.authenticated? <Route path='/stories' component={ Stories } /> : null }
				<Route path='/accepted' component={ Accepted } />
				<Route path='/unaccepted' component={ Unaccepted } />
				<Redirect from='/' to='/unaccepted'/>
			</Switch>
		</BrowserRouter>
		);
	}
}

export default App;
