import React, { Component } from 'react';
import Store from '../store/store';
import * as actions from '../store/actions/app.actions';
import Map from './map';
import Restaurant from './restaurant';
import '../styles/query.css';

class Query extends Component {

	constructor(props) {
		super(props);

		this.state = {
			restaurants: [],
			restaurant: null,
			distance: 0,
			index: 0
		}
		
		this.getRestaurants = this.getRestaurants.bind(this);
	}

	componentWillMount() {	
		// Retrieve Geolocation
		const options = {
			enableHighAccuracy: false,
			timeout: 6000000
		};
		
		if (navigator.geolocation) {	
			navigator.geolocation.getCurrentPosition(this.positionReceived, this.positionNotReceived);
			//navigator.geolocation.watchPosition(this.positionReceived, this.positionNotReceived, options);
		}  
	}

	// Geolocation function on success
	positionReceived = (position) => {	
		Store.dispatch(actions.SET_COORDINATES_ACTION(position.coords.latitude, position.coords.longitude));
	}

	// Geolocation function on failure
	positionNotReceived = (error) => {	
		// TODO: warning modal
		console.log(error);
	}

	// Function to shift left
	prev = () => {	
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
	next = () => {	
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

	select = () => {
		const selection = this.state.restaurants[this.state.index];
		Store.dispatch(actions.SET_FAVORITES_ACTION(selection));
		this.props.history.push({ pathname: '/stories' })
	}

	// Function to submit distance
	submit = (event) => {	
		event.preventDefault();
		const dist = this.state.distance;

		if (isNaN(dist) || !dist || dist.length <= 0) {	
			// TODO: warning modal
			console.log('Error: input is not a number');
		}
		else {	
			Store.dispatch(actions.SET_DISTANCE_ACTION(parseInt(dist)));
		}
	}

	handleInput = (event) => {
		event.preventDefault();
		this.setState(
			{
				...this.state,
				distance: event.target.value
			}
		);
	}

	getRestaurants = (restaurants) => {	
		if (restaurants) {

			const list  = this.shuffle(restaurants);
			this.setState(
				{
					...this.state,
					index: 0,
					restaurants: list.length > 0? list : [],
					restaurant: list.length > 0? list[0] : null
				}
			);
		}	
	}

	shuffle = (originalArray) => {
		var array = [].concat(originalArray);
		var currentIndex = array.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="query-container">

						<form className="form" onSubmit={ this.submit }>
							<label> Distance (km) </label>
							<input type="text" onChange={ (event) => this.handleInput(event) } />
							<button>LOOK UP</button>
						</form>

						<Restaurant restaurant = { this.state.restaurant } />

						<button type="button" className="btn btn-dark btn-lg" onClick={ this.prev }> PREV </button>
						<button type="button" className="btn btn-dark btn-lg" onClick={ this.select }> SELECT </button>
						<button type="button" className="btn btn-dark btn-lg" onClick={ this.next }> NEXT </button>

						<Map getRestaurants={ this.getRestaurants } />
					</div>
				</div>
			</div>
		);
	}
}

export default Query;
