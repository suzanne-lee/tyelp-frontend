import React, { Component } from 'react';
import '../styles/restaurant.css';

class Restaurant extends Component {

    render() {

        const { props: { restaurant } } = this;

        return (
            restaurant?
                <div className="restaurant-container"> 
                    Name: { restaurant.name } <br></br>
                    Rating: { restaurant.rating } <br></br>
                    Price level: { restaurant.price_level } <br></br>
                    Address: { restaurant.vicinity }
                </div> : 
                <div className="restaurant-container"></div>
        );
    }
}

export default Restaurant;
