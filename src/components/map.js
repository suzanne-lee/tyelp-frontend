import React, {Component} from "react";
import {connect} from "react-redux";
import { compose, withProps, lifecycle } from 'recompose';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import store from '../store';
import * as config from "../config";
import axios from "axios";
import * as maps from "../maps";
import { MATCH_ACTION } from "../store/action";
import * as moment from "moment";

const MyMap = withGoogleMap(props => (
    <GoogleMap
        zoom={15}
        center={props.center}
    >
        <Marker position={props.center} icon="/me.png"/>
        {props.children}
        { /*props.directions && <DirectionsRenderer directions={props.directions}/>*/ }
    </GoogleMap>
))

/**
    @typedef {import("../maps").NearbySearchItem} Item
    @typedef {
        import("react-google-maps").GoogleMapProps &
        {
            center : import("../store").LatLng,
            getMapDetails : ({
                restaurants : [],
                direction : [],
            }) => void,
            onMatch : (args : {
                placeId : string,
            }) => void,
            onMatchSelected : (args : {
                placeId : string,
            }) => void,
            currentMatch : undefined|{ placeId : string },
            matches : import("../store").Match[],
        }
    } MapProps
    @typedef {{
        googleApi : import("../maps").GoogleApi|undefined,
        errorMessages : {
            places? : string,
        },
        nearby? : Item[],
        nearbySkipped? : Item[],
        currentMatchItem : undefined|Item,
        directions : undefined|import("../maps").RouteResult,
    }} MapState

    @extends {Component<MapProps, MapState>}
*/
class Map extends Component {
    /** @param {import("react-google-maps").GoogleMapProps} props */
    constructor (props) {
        super(props);
        /** @type {MapState} */
        this.state = {
            googleApi : undefined,
            errorMessages : {},
            currentMatchItem : undefined,
            directions : undefined,
        };
    }

    newNearbySearch = () => {
        const map = this.map;
        if (map === undefined) {
            return;
        }
        this.setState({
            nearby : undefined,
            nearbySkipped : undefined,
        });
        maps.nearbySearch(
            map,
            {
                location: this.props.center,
                radius: 2000,
                type: "restaurant",
                query : "restaurant",
            },
            (result, _status, pagination) => {
                if (pagination.hasNextPage) {
                    pagination.nextPage();
                }
                for (let i=0; i<result.length-1; ++i) {
                    const r = i + Math.floor(Math.random() * (result.length - i));
                    const tmp = result[i];
                    result[i] = result[r];
                    result[r] = tmp;
                }
                const nearby = this.state.nearby;
                this.setState({
                    nearby : (
                        nearby === undefined ?
                        result :
                        [...nearby, ...result]
                    )
                });
            }
        );
    };

    /** @param {any} map */
    onMapLoad (map) {
        this.newNearbySearch();
        this.tryLoadMatch(this.props);
        map.fitBounds(this.getNearbyBounds());
    }

    /** @param {GoogleMap|null} ref */
    onMapRef = (ref) => {
        if (ref === null) {
            return;
        }
        const waitForMap = setInterval(() => {
            const map = /** @type {any} */(ref.state).map;
            if (map instanceof Object) {
                clearInterval(waitForMap);
                this.map = map;
                this.onMapLoad(map);
            }
        }, 100);
    };

    componentWillMount () {
        maps.getOrLoad((googleApi) => {
            this.setState({
                googleApi,
            });
            console.error("TravelMode", googleApi.maps.TravelMode);
        });
        this.tryLoadMatch(this.props);
    }
    /** @param {MapProps} props */
    componentWillReceiveProps (props) {
        this.tryLoadMatch(props);
    }

    /** @param {MapProps} props */
    tryLoadMatch (props) {
        if (props.currentMatch === undefined) {
            return;
        }
        const currentMatch = props.currentMatch;
        const map = this.map;
        if (map === undefined) {
            return;
        }
        const matchData = props.matches.find(
            (m) => m.placeId === currentMatch.placeId
        );
        if (matchData === undefined) {
            return;
        }
        this.setState({
            currentMatchItem : undefined,
            directions : undefined,
        });
        maps.getDetails(
            map,
            { placeId : currentMatch.placeId },
            (result) => {
                if (
                    this.props.currentMatch === undefined ||
                    this.props.currentMatch.placeId !== result.place_id
                ) {
                    //The currentMatch has changed
                    return;
                }
                this.setState({
                    currentMatchItem : {
                        ...result,
                        matchedAt : matchData.matchedAt,
                    }
                });

                maps.route(
                    {
                        origin : this.props.center,
                        destination : {
                            lat : result.geometry.location.lat(),
                            lng : result.geometry.location.lng(),
                        },
                        travelMode : "WALKING",
                    },
                    (result) => {
                        this.setState({
                            directions : result,
                        });
                    }
                );
            }
        );
    }

    /**
        @param {number} rating
        @returns {JSX.Element}
    */
    renderRating (rating) {
        if (typeof rating !== "number") {
            return <div style={{ color : "gray" }}>Unknown rating</div>
        }
        if (rating < 0) {
            rating = 0;
        }
        if (rating > 5) {
            rating = 5;
        }
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
        @param {0|1|2|3|4} priceLevel
        @returns {string}
    */
    getPriceLevelText (priceLevel) {
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
    renderPriceLevel (priceLevel) {
        if (typeof priceLevel !== "number") {
            return <div style={{ color : "gray" }}>{this.getPriceLevelText(priceLevel)}</div>
        }
        const dollarSigns = [];
        for (let i=0; i<priceLevel; ++i) {
            dollarSigns.push(<i key={i} className="fas fa-dollar-sign"></i>);
        }
        return (
            <div>
                {dollarSigns}
                &nbsp;
                {this.getPriceLevelText(priceLevel)}
            </div>
        );
    }

    /** @param {import("../maps").NearbySearchItem} item */
    renderOpenNow (item) {
        if (item.opening_hours === undefined) {
            return <div style={{ color : "gray" }}>No known opening hours</div>;
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

    /** @param {import("../maps").NearbySearchItem} item */
    renderPhoto (item) {
        const photo = (
            item.photos === undefined || item.photos.length == 0 ?
            {
                getUrl : () => "/no-image.png",
                width : 1024,
                height : 768,
            } :
            item.photos[0]
        );

        return <img className="card-img-top" src={photo.getUrl()} height={320}/>
    }
    /** @param {Item} item */
    renderMatchedAt (item) {
        const match = this.props.matches.find(
            (m) => m.placeId === item.place_id
        );
        if (match === undefined) {
            return <div>&nbsp;</div>;
        } else {
            return (
                <div>
                    <small>
                        You matched at {moment(match.matchedAt).format("YYYY MMM DD, hh:mm A")}
                    </small>
                </div>
            );
        }
    }

    /**
        @param {Item} item
        @param {() => JSX.Element} renderActions
    */
    renderItem (item, renderActions) {
        return (
            <div className="card">
                {this.renderPhoto(item)}
                <div className="card-body">
                    <h5 className="card-title">
                        {item.name}
                    </h5>
                    <small>
                        <img src={item.icon} width={16} height={16}/>{item.vicinity}
                    </small>
                    {this.renderOpenNow(item)}
                    {this.renderRating(item.rating)}
                    {this.renderPriceLevel(item.price_level)}
                    {this.renderMatchedAt(item)}
                    {renderActions()}
                </div>
            </div>
        );
    }
    renderEndOfNearbyItems () {
        const nearbySkipped = (this.state.nearbySkipped == undefined) ?
            [] :
            this.state.nearbySkipped;
        return (
            <div className="card">
                <img className="card-img-top" src={"/the-end.jpg"} height={320}/>
                <div className="card-body">
                    <h5 className="card-title">
                        The End
                    </h5>
                    You've reached the end. Would you like to start over?
                    <div style={{ color : "gray" }}>
                        <small>
                            {nearbySkipped.length} restaurants found
                        </small>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-outline-warning btn-lg float-left"
                            style={{ width : "75px" }}
                            onClick={() => {
                                const nearbySkipped = (this.state.nearbySkipped == undefined) ?
                                    [] :
                                    this.state.nearbySkipped;
                                this.setState({
                                    nearby : nearbySkipped,
                                    nearbySkipped : [],
                                });
                            }}
                            disabled={
                                this.state.nearbySkipped == undefined ||
                                this.state.nearbySkipped.length == 0
                            }
                        >
                            <i className="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    renderTopItem () {
        if (this.state.nearby == undefined) {
            return null;
        }
        if (this.state.nearby.length == 0) {
            return this.renderEndOfNearbyItems();
        }
        const item = this.state.nearby[0];
        return this.renderItem(item, () => {
            const match = this.props.matches.find(
                (m) => m.placeId === item.place_id
            );
            return (
                <div>
                    <button
                        type="button"
                        className="btn btn-outline-warning btn-lg float-left"
                        style={{ width : "75px" }}
                        onClick={() => {
                            const nearby = (this.state.nearby == undefined) ?
                                [] :
                                this.state.nearby;
                            const nearbySkipped = (this.state.nearbySkipped == undefined) ?
                                [] :
                                this.state.nearbySkipped;
                            if (nearbySkipped == undefined || nearbySkipped.length == 0) {
                                return;
                            }
                            this.setState({
                                nearby : [nearbySkipped[nearbySkipped.length-1], ...nearby],
                                nearbySkipped : nearbySkipped.slice(0, nearbySkipped.length-1),
                            });
                        }}
                        disabled={
                            this.state.nearbySkipped == undefined ||
                            this.state.nearbySkipped.length == 0
                        }
                    >
                        <i className="fas fa-undo"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-lg float-left"
                        style={{ width : "75px" }}
                        onClick={() => {
                            const nearby = this.state.nearby;
                            if (nearby == undefined) {
                                return;
                            }
                            const nearbySkipped = (this.state.nearbySkipped == undefined) ?
                                [] :
                                this.state.nearbySkipped;
                            this.setState({
                                nearby : nearby.slice(1),
                                nearbySkipped : [...nearbySkipped, nearby[0]],
                            });
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    {
                        match === undefined ?
                        <button
                            type="button"
                            className="btn btn-outline-success btn-lg float-right"
                            style={{ width : "75px" }}
                            onClick={() => {
                                this.props.onMatch({
                                    placeId : item.place_id,
                                });
                            }}
                        >
                            <i className="fas fa-heart"></i>
                        </button> :
                        <button
                            type="button"
                            className="btn btn-outline-info btn-lg float-right"
                            style={{ width : "75px" }}
                            onClick={() => {
                                this.props.onMatchSelected({
                                    placeId : item.place_id,
                                });
                            }}
                        >
                            <i className="fas fa-directions"></i>
                        </button>
                    }
                </div>
            )
        });
    }

    renderNearbyMarkers () {
        if (this.state.googleApi == undefined) {
            return null;
        }
        if (this.state.nearby === undefined) {
            return null;
        }
        const googleApi = this.state.googleApi;

        const max = this.state.nearby.length;
        const result = [];
        for (let i=0; i<max; ++i) {
            const item = this.state.nearby[i];
            const icon = (i > 0) ?
                {
                    size: new googleApi.maps.Size(16, 16),
                    scaledSize: new googleApi.maps.Size(16, 16),
                    url: item.icon
                } :
                undefined;
            result.push(<Marker
                key={item.place_id}
                icon={icon}
                position={item.geometry.location}
            />);
        }
        return result;
    }
    renderCurrentMatch () {
        if (this.state.currentMatchItem === undefined) {
            return null;
        }
        return this.renderItem(this.state.currentMatchItem, () => {
            return (
                <div>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg float-left"
                        style={{ width : "75px" }}
                        onClick={() => {
                            this.setState({
                                currentMatchItem : undefined,
                                directions : undefined,
                            });
                        }}
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                </div>
            );
        });
    }
    renderTopItemOrCurrentMatch () {
        if (this.state.currentMatchItem === undefined) {
            return this.renderTopItem();
        } else {
            return this.renderCurrentMatch();
        }
    }
    renderDirections () {
        if (this.state.directions === undefined) {
            return null;
        }
        return <DirectionsRenderer directions={this.state.directions} />;
    }
    renderNearbyMarkersOrDirections () {
        if (this.state.directions === undefined || this.state.currentMatchItem === undefined) {
            return this.renderNearbyMarkers();
        } else {
            return this.renderDirections();
        }
    }
    getNearbyBounds () {
        let north = this.props.center.lat;
        let east = this.props.center.lng;
        let south = this.props.center.lat;
        let west = this.props.center.lng;

        const nearby = (this.state.nearby === undefined) ?
            [] :
            this.state.nearby;
        for (let item of nearby) {
            const lat = item.geometry.location.lat();
            const lng = item.geometry.location.lng();

            if (lat > north) {
                north = lat;
            }
            if (lng > east) {
                east = lng;
            }
            if (lat < south) {
                south = lat;
            }
            if (lng < west) {
                west = lng;
            }
        }
        return {
            north,
            east,
            south,
            west,
        };
    }
    render () {
        if (this.state.googleApi == undefined) {
            return null;
        }
        if (this.map !== undefined) {
            this.map.fitBounds(this.getNearbyBounds());
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        {this.renderTopItemOrCurrentMatch()}
                    </div>
                    <div className="col-sm" style={{ minHeight : "380px" }}>
                        <MyMap
                            loadingElement={<div style={{ height: '100%' }} />}
                            containerElement={<div style={{ height: '100%' }} />}
                            mapElement={<div style={{ height: '100%' }} />}
                            center={this.props.center}
                            ref={this.onMapRef}
                        >
                            {this.renderNearbyMarkersOrDirections()}
                        </MyMap>
                    </div>
                </div>
            </div>
        );
    }
}

/*const Map2 = compose(
    withProps({
        googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&v=3.exp&libraries=geometry,drawing,places',
        loadingElement: <div style={{ height: '100%' }} />,
        containerElement: <div style={{ height: '400px' }} />,
        mapElement: <div style={{ height: '100%' }} />
    }),
    lifecycle({
        componentWillMount () {
            this.setState({
                center: {
                    lat: 41.9,
                    lng: -87.624
                },
                places: [],
                directions: [],
                /** @param {GoogleMap|undefined} ref * /
                onMapMounted: (ref) => {
                    if (ref == undefined) {
                        return;
                    }
                    const state = store.getState().app;

                    this.setState(
                        {
                            ...this.state,
                            center: {
                                lat: state.coordinates.latitude,
                                lng: state.coordinates.longitude
                            }
                        }
                    );

                    const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);

                    const request = {
                        location: new google.maps.LatLng(state.coordinates.latitude, state.coordinates.longitude),
                        radius: ('' + state.distance),
                        type: ['restaurant']
                    };

                    service.nearbySearch(request, (result, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            this.setState(
                                {
                                    ...this.state,
                                    places: result
                                }
                            );
                        }
                    });

                    store.subscribe(
                        () => {

                            const updatedState = store.getState().app;

                            if (updatedState.queryMode === 'lookup') {

                                this.setState(
                                    {
                                        ...this.state,
                                        center: {
                                            lat: updatedState.coordinates.latitude,
                                            lng: updatedState.coordinates.longitude
                                        }
                                    }
                                );

                                const updatedRequest = {
                                    location: new google.maps.LatLng(updatedState.coordinates.latitude, updatedState.coordinates.longitude),
                                    radius: ('' + updatedState.distance),
                                    type: ['restaurant']
                                };

                                service.nearbySearch(updatedRequest, (result, status) => {

                                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                                        this.setState(
                                            {
                                                ...this.state,
                                                places: result
                                            }
                                        );
                                    }
                                    else {
                                        this.setState(
                                            {
                                                ...this.state,
                                                places: []
                                            }
                                        );
                                    }
                                });
                            }
                        }
                    );
                },
                onDirectionRender: destination => {

                    if (destination && destination.destination && destination.destination !== -1) {

                        const DirectionsService = new google.maps.DirectionsService();
                        var travel_mode = google.maps.TravelMode.WALKING;

                        if (destination.travelMode === 'driving') {
                            travel_mode = google.maps.TravelMode.DRIVING;
                        }
                        else if (destination.travelMode === 'transit') {
                            travel_mode = google.maps.TravelMode.TRANSIT;
                        }

                        DirectionsService.route({
                                origin: new google.maps.LatLng(this.state.center.lat, this.state.center.lng),
                                destination: destination.destination,
                                travelMode: travel_mode,
                            }, (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                this.setState({
                                    directions: result,
                                });
                            } else {
                                //console.error('Cannot fetch direction(s)');
                            }
                        });
                    }
                }
            });
        }
    }),
    withScriptjs,
    withGoogleMap
)((props) => {
    return (
        <GoogleMap
            ref={props.onMapMounted}
            defaultZoom={ 12 }
            center={ props.center }
            { ...props.getMapDetails({
                restaurants: props.places,
                direction: props.directions
            }) }
            { ...props.onDirectionRender(props.destination) }
        >
            {
                props.places && props.places.map(
                    (place, i) => <Marker key={ i } position={ { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } } />
                )
            }

            { props.directions && <DirectionsRenderer directions={props.directions} />}
        </GoogleMap>
    );
});
*/

export default Map;