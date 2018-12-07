import React, { Component } from 'react';
import '../styles/restaurant.css';

class Restaurant extends Component {

    render() {

        const { props: { restaurant } } = this;
        if (restaurant) console.log(restaurant.photos[0].html_attributions)
        return (
            restaurant?
                <div className="restaurant-container"> 
                    Name: { restaurant.name } <br></br>
                    Rating: { restaurant.rating } <br></br>
                    Price level: { restaurant.price_level } <br></br>
                    Address: { restaurant.vicinity }
                    <a href="https://maps.google.com/maps/contrib/108432994626054602453/photos">chandran mutitah</a>
                </div> : 
                <div className="restaurant-container"></div>
        );
    }
}

export default Restaurant;
