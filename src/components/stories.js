import React, { Component } from 'react';
import Store from '../store/store';

class Stories extends Component {

	constructor(props) 
	{
		super(props);

		this.state = {
			stories: []
		}

		this.leave = this.leave.bind(this);
	}

	componentDidMount()
	{	
		this.setState(
			{	
				...this.state,
				stories: Store.getState().app.user.stories
			}
		);

		Store.subscribe(
			() => {
				this.setState({
					...this.state,
					stories: Store.getState().app.user.stories
				});
			}
		);
	}

	// Function to route to Query component
	leave()
	{
		this.props.history.push({ pathname: '/query' });
	}

	render() {
		return (
			<div>
				Stories Page
			</div>
		);
	}
}

export default Stories;
