import React, {Component} from "react";
import {withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import * as maps from "../maps";
import {PlaceCard} from "./place-card";

const MyMap = withGoogleMap(props => (
    <GoogleMap
        zoom={15}
        center={props.center}
    >
        <Marker position={props.center} icon="/me.png"/>
        {props.children}
    </GoogleMap>
))

/**
    @typedef {import("../maps").NearbySearchItem} Item
    @typedef {
        import("react-google-maps").GoogleMapProps &
        {
            center : import("../store").LatLng,
            onMatch : (args : import("../store").Match) => void,
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

    renderEndOfNearbyItems () {
        const nearbySkipped = (this.state.nearbySkipped === undefined) ?
            [] :
            this.state.nearbySkipped;
        return (
            <div className="card">
                <img className="card-img-top" src={"/the-end.jpg"} height={320} alt="The End"/>
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
                                const nearbySkipped = (this.state.nearbySkipped === undefined) ?
                                    [] :
                                    this.state.nearbySkipped;
                                this.setState({
                                    nearby : nearbySkipped,
                                    nearbySkipped : [],
                                });
                            }}
                            disabled={
                                this.state.nearbySkipped === undefined ||
                                this.state.nearbySkipped.length === 0
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
        if (this.state.nearby === undefined) {
            return null;
        }
        if (this.state.nearby.length === 0) {
            return this.renderEndOfNearbyItems();
        }
        const item = this.state.nearby[0];
        const match = this.props.matches.find(
            (m) => m.placeId === item.place_id
        );
        return (
            <PlaceCard item={item} matches={this.props.matches}>
                <button
                    type="button"
                    className="btn btn-outline-warning btn-lg float-left"
                    style={{ width : "75px" }}
                    onClick={() => {
                        const nearby = (this.state.nearby === undefined) ?
                            [] :
                            this.state.nearby;
                        const nearbySkipped = (this.state.nearbySkipped === undefined) ?
                            [] :
                            this.state.nearbySkipped;
                        if (nearbySkipped === undefined || nearbySkipped.length === 0) {
                            return;
                        }
                        this.setState({
                            nearby : [nearbySkipped[nearbySkipped.length-1], ...nearby],
                            nearbySkipped : nearbySkipped.slice(0, nearbySkipped.length-1),
                        });
                    }}
                    disabled={
                        this.state.nearbySkipped === undefined ||
                        this.state.nearbySkipped.length === 0
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
                        if (nearby === undefined) {
                            return;
                        }
                        const nearbySkipped = (this.state.nearbySkipped === undefined) ?
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
                                matchedAt : new Date(),
                                placeId : item.place_id,
                                name : item.name,
                                rating : item.rating,
                                priceLevel : item.price_level,
                                vicinity : item.vicinity,
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
            </PlaceCard>
        )
    }

    renderNearbyMarkers () {
        if (this.state.googleApi === undefined) {
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
        return (
            <PlaceCard item={this.state.currentMatchItem} matches={this.props.matches}>
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
            </PlaceCard>
        );
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
        if (this.state.googleApi === undefined) {
            return null;
        }
        if (this.map !== undefined && this.state.currentMatchItem === undefined) {
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

export default Map;