import React, { Component } from 'react';
//import Store from '../store/store';
//import * as actions from '../store/actions/app.actions';
import Map from './map';
import Restaurant from './restaurant';
import '../styles/query.css';

class Query extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			latitude: -1,
			longitude: -1,
			distance: -1,
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
	}

	componentDidMount()
	{	
		// Retrieve Geolocation
		const options = {
			enableHighAccuracy: false,
			timeout: 60000
		};
		
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(this.positionReceived,this.positionNotReceived);
			navigator.geolocation.watchPosition(this.positionReceived,this.positionNotReceived, options);
		} 
	}

	// Geolocation function on success
	positionReceived = (position) =>
	{	
		this.setState(
			{
				...this.state,
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			}
		);
	}

	// Geolocation function on failure
	positionNotReceived = (error) =>
	{
		console.log(error);
	}

	// Function to shift left
	prev = () =>
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
	next = () =>
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

	// Function to submit distance
	submit = (event) =>
	{	
		event.preventDefault();

		console.log(this);

		//const dist = this.state.distance;
		
		if (isNaN(0)) 
		{
			console.log('Error: input is not a number');
		}
		else
		{	
			
		}
	}

	handleInput = (event) =>
	{
		event.preventDefault();
		const dist = event.target.value;
		this.setState(
			{
				...this.state,
				distance: dist
			}
		);
	}

	render() {

		return (
			<div className="container-fluid">
				<div className="row">
					<div className="query-ctn">
						<form className="form" onSubmit={ this.submit }>
							<label> Distance (km) </label>
							<input type="text" onChange={ (event) => this.handleInput(event) } />
							<button>LOOK UP</button>
						</form>
						<Restaurant
							restaurant = { this.state.restaurant }
						/>

						<button type="button" className="btn btn-dark btn-lg" onClick={ this.prev }>
							PREV
						</button>
						<button type="button" className="btn btn-dark btn-lg" onClick={ this.next }>
							NEXT
						</button>

						<Map
							//googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCl2oicdbO4LjkylDN5w6trSvQBdb6-9zo&v=3.exp&libraries=geometry,drawing,places`}
							//loadingElement={<div style={{ height: `100%` }} />}
							//containerElement={<div style={{ height: `600px`, width: `600px` }} />}
							//mapElement={<div style={{ height: `100%` }} />}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Query;
