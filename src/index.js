import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import App from "./App";
import store from "./store";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import * as cookie from "js-cookie";
import {ME_ACTION} from "./store/action";
import {LAT_LNG_UPDATE} from "./store/action/lat-lng";

function logInFromCookie () {
    const authenticationToken = cookie.get("authenticationToken");
    if (typeof authenticationToken === "string") {
        store.dispatch(ME_ACTION({
            authenticationToken,
        }));
    }
}
function initGeoLocation () {
    const lastLatLng = cookie.get("lastLatLng");
    console.log("lastLatLng", lastLatLng);
    if (lastLatLng === undefined) {
        store.dispatch(LAT_LNG_UPDATE({
            //LatLng for Saint Laurent Montreal
            lng: -73.6995759,
            lat: 45.505724099999995,
        }));
    } else {
        store.dispatch(LAT_LNG_UPDATE(JSON.parse(lastLatLng)));
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("currentPosition", position.coords);
            store.dispatch(LAT_LNG_UPDATE({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            }));
        });
        navigator.geolocation.watchPosition((position) => {
            console.log("updatedPosition", position.coords);
            store.dispatch(LAT_LNG_UPDATE({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            }));
        });
    }
}

logInFromCookie();
initGeoLocation();
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);

/**
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: http://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
