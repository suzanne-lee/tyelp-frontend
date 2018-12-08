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
			favorites: [],
			restaurant: null,
			distance: 0,
			index: 0,
			destination: {
				travelMode: "walk",
				destination: -1
			},
			travel: {
				distance: "",
				time: ""
			},
			queryMode: 'lookup'
		}
		
		this.getMapDetails = this.getMapDetails.bind(this);
	}

	componentWillMount() {	
		// Retrieve Geolocation
		
		/*
		const options = {
			enableHighAccuracy: false,
			timeout: 6000000
		}; */
		
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
		if (this.state.restaurants.length > 0) {
			
			const selection = this.state.restaurants[this.state.index];
			Store.dispatch(actions.SET_FAVORITES_ACTION({
				queryMode: 'select',
				selection: selection
			}));
      Store.dispatch(actions.SET_HISTORY_ACTION(
        Store.getState().app.user.userID,
        selection.name,
				selection.rating,
				selection.price_level,
				selection.vicinity
      ));
			
			this.setState({
				...this.state,
				destination: {
					...this.state.destination,
					destination: this.state.restaurants[this.state.index].vicinity
				},
				queryMode: 'select'
			});
		}
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
			Store.dispatch(actions.SET_DISTANCE_ACTION(
				{	
					queryMode: 'lookup',
					distance: parseInt(dist)
				}
			));

			this.setState({
				...this.state,
				queryMode: 'lookup'
			});
		}
	}

	handleInput = (event) => {
		event.preventDefault();
		this.setState(
			{
				...this.state,
				distance: (event.target.value) / 1000
			}
		);
	}

	travelMode = (event) => {
		event.preventDefault();
		this.setState({
			...this.state,
			destination: {
				...this.state.destination,
				travelMode: event.target.value
			},
		})
	}

	getMapDetails = (details) => {	
		if (details) {

			if (this.state.queryMode === 'lookup') {
				
				const list  = this.shuffle(details.restaurants);
				const direction = details.direction;

				this.setState(
					{
						...this.state,
						index: 0,
						restaurants: list.length > 0? list : [],
						restaurant: list.length > 0? list[0] : null,
						travel: {
							distance: direction.routes && direction.routes.length > 0 && direction.routes[0].legs.length > 0? direction.routes[0].legs[0].distance.text : "",
							time: direction.routes && direction.routes.length > 0 && direction.routes[0].legs.length > 0? direction.routes[0].legs[0].duration.text : ""
						}
					}
				);
			}
			else {	
				const direction = details.direction;
				
				this.setState(
					{
						...this.state,
						travel: {
							distance: direction.routes && direction.routes.length > 0 && direction.routes[0].legs.length > 0? direction.routes[0].legs[0].distance.text : "",
							time: direction.routes && direction.routes.length > 0 && direction.routes[0].legs.length > 0? direction.routes[0].legs[0].duration.text : ""
						}
					}
				);
			}
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
							<label> Distance (m) </label>
							<input type="text" onChange={ (event) => this.handleInput(event) } />
							<button type="button" className="btn btn-success">LOOK UP</button>
							<div className="travel-mode">
								<select onChange={ (event) => this.travelMode(event) }>
									<option value="walk">Walk</option>
  									<option value="transit">Transit</option>
									  <option value="driving">Driving</option>
								</select>
							</div>
							<div className="travel-info">
								<label> Travel Distance: { this.state.travel.distance } </label>
								<label> Travel Distance: { this.state.travel.time } </label>
							</div>
						</form>

						<Restaurant restaurant = { this.state.restaurant } />	
						<div className="row">
							<div className="col-1">
								<button type="button" className="btn btn-outline-primary" onClick={ this.prev }> PREV </button>
							</div>
							<div className="col-1">
								<button type="button" className="btn btn-primary" onClick={ this.select }> SELECT </button>
							</div>
							<div className="col-1">
								<button type="button" className="btn btn-outline-primary" onClick={ this.next }> NEXT </button>
							</div>
						</div>
						<Map getMapDetails={ this.getMapDetails } destination={ this.state.destination } />
					</div>
				</div>
			</div>
		);
	}
}

export default Query;
