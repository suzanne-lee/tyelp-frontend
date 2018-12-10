import React, {Component} from "react";
import * as moment from "moment";
import {Rating} from "./rating";
import {PriceLevel} from "./price-level";

/**
    @typedef {{
        icon: string|null,
        name: string,
        opening_hours?: import("../maps").OpeningHours|null,
        photos?: import("../maps").PlacePhoto[]|null,
        place_id: string,
        price_level : 0|1|2|3|4,
        rating: number,
        vicinity: string,
        permanently_closed? : true,
    }} Item
    @typedef {{
        item : Item,
        matches : import("../store").Match[],
        className? : string,
        singleLine? : boolean
    }} PlaceCardProps
    @typedef {{}} PlaceCardState

    @extends {Component<PlaceCardProps, PlaceCardState>}
*/
export class PlaceCard extends Component {
    renderOpenNow () {
        const item = this.props.item;
        if (item.opening_hours === undefined) {
            return <div style={{ color : "gray" }}>No known opening hours</div>;
        }
        if (item.opening_hours === null) {
            return null;
        }
        return item.opening_hours.open_now ?
            <div style={{ color : "green" }}>Open</div> :
            <div style={{ color : "red" }}>
                {
                    item.permanently_closed ?
                        "Permanantly Closed =(" :
                        "Closed"
                }
            </div>
    }
    renderPhoto () {
        const item = this.props.item;
        if (item.photos === null) {
            return null;
        }
        const photo = (
            item.photos === undefined || item.photos.length === 0 ?
            {
                getUrl : () => "/no-image.png",
                width : 1024,
                height : 768,
            } :
            item.photos[0]
        );

        return <img className="card-img-top" src={photo.getUrl()} height={320} alt={item.name}/>
    }
    renderMatchedAt () {
        const item = this.props.item;
        const match = this.props.matches.find(
            (m) => m.placeId === item.place_id
        );
        if (match === undefined) {
            return <div>&nbsp;</div>;
        } else {
            return (
                <div>
                    <small>
                        Matched @ {moment(match.matchedAt).format("YYYY MMM DD, hh:mm A")}
                    </small>
                </div>
            );
        }
    }
    render () {
        const item = this.props.item;
        /** @type {import("react").CSSProperties} */
        const singleLineStyle = (this.props.singleLine === true) ?
            {
                overflow : "hidden",
                whiteSpace : "nowrap",
                textOverflow : "ellipsis",
            } :
            {}
        return (
            <div className={`card ${this.props.className === undefined ? "" : this.props.className}`}>
                {this.renderPhoto()}
                <div className="card-body">
                    <h5 className="card-title" style={singleLineStyle}>
                        {item.name}
                    </h5>
                    <div style={singleLineStyle}>
                        <small>
                            {
                                typeof item.icon === "string" ?
                                <img src={item.icon} width={16} height={16} alt="Icon"/> :
                                null
                            }
                            {item.vicinity}
                        </small>
                    </div>
                    {this.renderOpenNow()}
                    <Rating rating={item.rating}/>
                    <PriceLevel priceLevel={item.price_level}/>
                    {this.renderMatchedAt()}
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}