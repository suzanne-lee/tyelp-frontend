import React, { Component } from 'react';

class Story extends Component {

    render() {

        const { props: { item } } = this;
        const id = item.id;
        const restaurant = item.restaurant;

        return (
            <div className="story-container">
                id: { id }, 
                Restaurant: { restaurant.toUpperCase() }
            </div>
        );
    }
}

export default Story;
