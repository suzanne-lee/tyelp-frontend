import React, { Component } from 'react';
import Store from '../store/store';
import * as actions from '../store/actions/home.actions';
//import Button from '@material-ui/core/Button';
import '../styles/home.css';

class Home extends Component {

	constructor(props)
	{
		super(props);
		this.submit = this.submit.bind(this);
	}

	submit(event)
	{	
		Store.dispatch(actions.GET_RESTAURANTS_ACTION(this.input.value));
		this.props.history.push({ pathname: '/ui' });
		event.preventDefault();
	}

	render() {
		return (
			<div className="ctn">
				{ /* Preference Submission Form */ } 
				<form className="form" onSubmit={this.submit}>
					<label> 
						Distance (km) 
						<input type="text" ref={(input) => this.input = input}/>
					</label>
					<input type="submit" value="Look Up"/>
				</form>
			</div>
		);
	}
}

export default Home;
