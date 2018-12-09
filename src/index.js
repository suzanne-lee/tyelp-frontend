import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import App from "./App";
import store from "./store";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import * as cookie from "js-cookie";
import { ME_ACTION } from "./store/action";
import { LNGLAT_UPDATE } from "./store/action/lnglat";

function logInFromCookie () {
    const authenticationToken = cookie.get("authenticationToken");
    if (typeof authenticationToken === "string") {
        store.dispatch(ME_ACTION({
            authenticationToken,
        }));
    }
}
function initGeoLocation () {
    const lastLngLat = cookie.get("lastLngLat");
    console.log("lastLngLat", lastLngLat);
    if (lastLngLat === undefined) {
        store.dispatch(LNGLAT_UPDATE({
            //LngLat for Saint Laurent Montreal
            lng: -73.6995759,
            lat: 45.505724099999995,
        }));
    } else {
        store.dispatch(LNGLAT_UPDATE(JSON.parse(lastLngLat)));
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("currentPosition", position.coords);
            store.dispatch(LNGLAT_UPDATE({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            }));
        });
        navigator.geolocation.watchPosition((position) => {
            console.log("updatedPosition", position.coords);
            store.dispatch(LNGLAT_UPDATE({
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
