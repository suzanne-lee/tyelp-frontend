import React, { Component } from 'react';

class Story extends Component {

    render() {

        const { props: { item } } = this;
        const restaurant = item;

        return (
            restaurant?
            <div className="story-container"> 
                Name: { restaurant.name } <br></br>
                Rating: { restaurant.rating } <br></br>
                Price level: { restaurant.price_level } <br></br>
                Address: { restaurant.vicinity }
            </div> : 
            <div className="story-container"></div>
        );
    }
}

export default Story;
