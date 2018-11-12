import React, { Component } from 'react';
import Store from '../store/store';
import * as actions from '../store/actions/app.actions';
import '../styles/query.css';

class Query extends Component {

	constructor(props)
	{
		super(props);
		this.submit = this.submit.bind(this);
	}

	submit(event)
	{	
		const dist = +(this.input.value);

		if (isNaN(dist)) 
		{
			console.log('Error: input is not a number');
		}
		else
		{	
			Store.dispatch(actions.GET_RESTAURANTS_ACTION(dist));
			this.props.history.push({ pathname: '/ui' });
		}

		event.preventDefault();
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="query-ctn">
						<form className="form" onSubmit={this.submit}>
							<label> 
								Distance (km) 
								<input type="text" ref={(input) => this.input = input}/>
							</label>
							<input type="submit" value="Look Up"/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Query;
