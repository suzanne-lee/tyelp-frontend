import React, { Component } from 'react';
//import Store from '../store/store';
import Story from './story';

class Stories extends Component {

	constructor(props) 
	{
		super(props);

		this.state = {
			stories: [ // dummy data
				{	
					id: 1,
					restaurant: 'Mcdonald'
				},
				{
					id: 2,
					restaurant: 'Orange'
				},
				{
					id: 3,
					restaurant: 'Ganadara'
				}
			]
		}

		this.back = this.back.bind(this);
	}

	componentDidMount()
	{	
		/*
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
		); */
	}

	// Function to route to Query component
	back()
	{
		this.props.history.push({ pathname: '/query' });
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="stories-container">
						{
							this.state.stories.map(
								(item,i) => 
									<Story
										key = { i }
										item = { item }
									/>	
							)
						}

						<button type="button" className="btn btn-dark btn-lg" onClick={ this.back }>
                            BACK
                        </button>
					</div>
				</div>
			</div>
		);
	}
}

export default Stories;
