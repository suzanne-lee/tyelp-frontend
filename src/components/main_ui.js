import React, { Component } from 'react';
//import Store from '../store/store';
import Restaurant from './restaurant';

class MainUI extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			restaurants: [ // dummy data
				{
					id: 0,
					restaurant: 'Poke'
				},
				{
					id: 1,
					restaurant: 'Schwartz'
				},
				{
					id: 2,
					restaurant: 'Pizza'
				}
			],
			restaurant: {
				id: 0,
				restaurant: 'Poke'
			}
			,
			index: 0
		}

		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
	}

	componentDidMount()
	{	
		/*
		this.setState(
			{	
				...this.state,
				restaurants: Store.getState().app.restaurants
			}
		);

		Store.subscribe(
			() => {
				this.setState({
					...this.state,
					restaurants: Store.getState().app.restaurants
				});
			}
		); */
	}

	// Function to shift left
	prev()
	{	
		const cur = this.state.index;
		const len = this.state.restaurants.length;
		const updated = cur - 1 < 0? (cur - 1 + len) % len : cur - 1;

		this.setState(
			{
				...this.state,
				index: updated,
				restaurant: this.state.restaurants[updated]
			}
		);
	}

	// Function to shift right
	next()
	{	
		const cur = this.state.index;
		const len = this.state.restaurants.length;
		const updated = (cur + 1) % len;

		this.setState(
			{
				...this.state,
				index: updated,
				restaurant: this.state.restaurants[updated]
			}
		);
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<Restaurant
						restaurant = { this.state.restaurant }
					/>

					<button type="button" className="btn btn-dark btn-lg" onClick={ this.prev }>
						PREV
					</button>
					<button type="button" className="btn btn-dark btn-lg" onClick={ this.next }>
						NEXT
					</button>
				</div>
			</div>
		);
	}
}

export default MainUI;
