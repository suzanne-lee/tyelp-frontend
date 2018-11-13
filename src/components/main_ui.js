import React, { Component } from 'react';
import Store from '../store/store';

class MainUI extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			restaurants: [],
			index: 0
		}

		this.left = this.left.bind(this);
		this.right = this.right.bind(this);
	}

	componentDidMount()
	{	
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
		);
	}

	// Function to shift left
	left()
	{	
		const cur = this.state.index;
		const len = this.state.restaurants.length;

		this.setState({
			...this.state,
			index: cur - 1 < 0? (cur + len) % len : cur
		})
	}

	// Function to shift right
	right()
	{
		const cur = this.state.index;
		const len = this.state.restaurants.length;

		this.setState({
			...this.componentDidMountstate,
			index: (cur + 1) % len
		})
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">

				</div>
			</div>
		);
	}
}

export default MainUI;
