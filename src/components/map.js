import React from "react";
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Store from '../store/store';

const google = window.google;

const Map = compose(
    withProps(
        {
            googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCl2oicdbO4LjkylDN5w6trSvQBdb6-9zo&v=3.exp&libraries=geometry,drawing,places',
            loadingElement: <div style={{ height: '100%' }} />,
            containerElement: <div style={{ height: '400px' }} />,
            mapElement: <div style={{ height: '100%' }} />
        }
    ),
    lifecycle(
        {
            componentWillMount()
            {   
                const refs = { };

                this.setState(
                    {
                        center: {
                            lat: 41.9,
                            lng: -87.624
                        },
                        places: [],
                        onMapMounted: ref => {
                            
                            refs.map = ref;

                            if (refs.map) {
                                
                                const state = Store.getState().app;    
                                
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

                                Store.subscribe(
                                    () => {

                                        const updatedState = Store.getState().app;

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
                                );
                            }
                        }
                    }
                );  
            }  
        }
    ),
    withScriptjs,
    withGoogleMap
)(
    (props) => {
        return (
            <GoogleMap
                ref={ props.onMapMounted }
                defaultZoom={ 12 }
                center={ props.center }
                { ...props.getRestaurants(props.places) }
            >      
                { 
                    props.places && props.places.map(
                        (place, i) => <Marker key={ i } position={ { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } } />
                    )
                }   
            </GoogleMap>
        )
    }
);

export default Map;
