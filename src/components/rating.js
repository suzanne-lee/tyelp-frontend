import React, {Component} from "react";

/**
    @param {number} rating
    @returns {JSX.Element}
*/
function renderRating (rating) {
    if (typeof rating !== "number") {
        return <div style={{ color : "gray" }}>Unknown rating</div>
    }
    if (rating < 0) {
        rating = 0;
    }
    if (rating > 5) {
        rating = 5;
    }
    rating = Math.floor(rating * 10)/10;
    const intRating = Math.floor(rating);
    const hasHalfRating = Math.round(rating - intRating) === 1;

    const stars = [];
    for (let i=0; i<intRating; ++i) {
        stars.push(<i key={i} className="fas fa-star"></i>);
    }
    if (hasHalfRating) {
        stars.push(<i key={"half"} className="fas fa-star-half-alt"></i>);
    }

    const starsLeft = 5 - Math.round(rating);
    for (let i=0; i<starsLeft; ++i) {
        stars.push(<i key={`stars-left-${i}`} className="far fa-star"></i>);
    }
    return (
        <div>
            {stars}
            {rating}/5.0
        </div>
    )
}


/**
    @typedef {{ rating : number }} RatingProps
    @typedef {{}} RatingState

    @extends {Component<RatingProps, RatingState>}
*/
export class Rating extends Component {
    render () {
        return renderRating(this.props.rating);
    }
}