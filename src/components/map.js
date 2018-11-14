import React from "react";
import { compose, withProps, withState, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";

const google = window.google;

const Map = compose(
    withProps(
        {
            googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=API_KEY&v=3.exp&libraries=geometry,drawing,places',
            loadingElement: <div style={{ height: '100%' }} />,
            containerElement: <div style={{ height: '400px' }} />,
            mapElement: <div style={{ height: '100%' }} />

        }
    ),
    withScriptjs,
    withGoogleMap,
    withState('restaurants','updateRestaurants',[]),
    withHandlers(
        () => {

            const refs = {
                map: undefined
            }

            return {
                
                onMapMounted: ({ updateRestaurants }) => ref => {
                    refs.map = ref;
                    const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                    const request = {
                        location: new google.maps.LatLng(-33.8665433,151.1956316),
                        radius: '500',
                        type: ['restaurant']
                    };

                    service.nearbySearch(request, (result, status) => {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            console.log(result);
                            updateRestaurants(result);
                        }
                    })
                }
            }
        }
    ),
)(
    (props) => {
        return (
            <GoogleMap
                ref={ props.onMapMounted }
                defaultZoom={ 8 }
                defaultCenter={{ lat: 51.508530, lng: -0.076132 }}
            >   
            </GoogleMap>
        )
    }
);

export default Map;
