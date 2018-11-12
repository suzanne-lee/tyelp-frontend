import React, { Component } from 'react';
import Store from '../store/store';

class MainUI extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			restaurants: []
		}

		Store.subscribe(
			() => {

				console.log(Store.getState());

				this.setState({
					restaurants: Store.getState()
				});
			}
		);
	}

	render() {
		return (
		<div>
		UI Page
		</div>
		);
	}
}

export default MainUI;
