import React, { Component } from 'react';
import '../styles/restaurant.css';

class Restaurant extends Component {

    render() {

        const { props: { restaurant } } = this;
        var photo = null;
        if (restaurant && restaurant.photos && restaurant.photos.length > 0) {
            photo = restaurant.photos[0].getUrl({ 'maxWidth': 300, 'maxHeight': 300 });
        }
        return (
            restaurant?
                <div className="restaurant-container"> 
                    Name: { restaurant.name } <br></br>
                    Rating: { restaurant.rating } <br></br>
                    Price level: { restaurant.price_level } <br></br>
                    Address: { restaurant.vicinity }
                    <img src={photo} ></img> 
                </div> : 
                <div className="restaurant-container"></div>
        );
    }
}

export default Restaurant;
