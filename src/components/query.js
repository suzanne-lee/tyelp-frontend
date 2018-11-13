import React, { Component } from 'react';
import Store from '../store/store';
import * as actions from '../store/actions/app.actions';
import '../styles/query.css';

const google = window.google;

class Query extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			latitude: -1,
			longitude: -1
		}

		this.positionReceived = this.positionReceived.bind(this);
		this.positionNotReceived = this.positionNotReceived.bind(this);
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
	positionReceived(position)
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
	positionNotReceived(error)
	{
		console.log(error);
	}

	// Function to submit distance
	submit(event)
	{	
		
		const dist = 500;//+(this.input.value);
		
		if (isNaN(dist)) 
		{
			console.log('Error: input is not a number');
		}
		else
		{	
			//while (this.state.latitude === -1 || this.state.longitude === -1) { }

			
			let list = ['Error'];
			
			
			
			const pyrmont = new google.maps.LatLng(50,50);
			
			/*
			const map = new google.maps.Map(document.getElementById('map'), {
				center: pyrmont,
				zoom: 15 
			}); */
			
			const request = {
				location: pyrmont,
				radius: dist,
				type: ['restaurant']
			}; 

			const service = new google.maps.places.PlacesService(null);
			
			service.nearbySearch(request, (res,status) => {
				list = res;
			}); 

			

			/*
			Store.dispatch(
				actions.GET_RESTAURANTS_ACTION(
					this.state.latitude,
					this.state.longitude,
					dist
				)
			); 
			
			//this.props.history.push({ pathname: '/ui' }); */
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
