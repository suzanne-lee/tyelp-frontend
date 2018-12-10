import React, {Component} from "react";
/**
    @param {0|1|2|3|4} priceLevel
    @returns {string}
*/
function getPriceLevelText (priceLevel) {
    switch (priceLevel) {
        case 0: {
            return "Free!";
        }
        case 1: {
            return "Cheap";
        }
        case 2: {
            return "Fairly Priced";
        }
        case 3: {
            return "Expensive";
        }
        case 4: {
            return "Very Expensive";
        }
        default: {
            return "Unknown Cost";
        }
    }
}
/**
    @param {0|1|2|3|4} priceLevel
    @returns {JSX.Element}
*/
function renderPriceLevel (priceLevel) {
    if (typeof priceLevel !== "number") {
        return <div style={{ color : "gray" }}>{getPriceLevelText(priceLevel)}</div>
    }
    const dollarSigns = [];
    for (let i=0; i<priceLevel; ++i) {
        dollarSigns.push(<i key={i} className="fas fa-dollar-sign"></i>);
    }
    return (
        <div>
            {dollarSigns}
            &nbsp;
            {getPriceLevelText(priceLevel)}
        </div>
    );
}

/**
    @typedef {{ priceLevel : 0|1|2|3|4 }} PriceLevelProps
    @typedef {{}} PriceLevelState

    @extends {Component<PriceLevelProps, PriceLevelState>}
*/
export class PriceLevel extends Component {
    render () {
        return renderPriceLevel(this.props.priceLevel);
    }
}