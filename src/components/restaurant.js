import React, { Component } from 'react';
import '../styles/restaurant.css';

class Restaurant extends Component {

    render() {

        const { props: { restaurant } } = this;

        return (
            <div className="restaurant-container">
                id: { restaurant.id }, 
                Restaurant: { restaurant.restaurant }
            </div>
        );
    }
}

export default Restaurant;