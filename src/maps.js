import * as config from "./config";

const callbackName = "googleMapsLoaded";
const url = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(config.googleApiKey)}&v=3.exp&libraries=geometry,drawing,places&callback=${callbackName}`;

/**
    @typedef {{

    }} SizeInstance
    @typedef {{
        getNorthEast: () => import("./store").LatLng,
        getSouthWest: () => import("./store").LatLng,
    }} LatLngBounds
    @typedef {{
        lat : () => number,
        lng : () => number,
    }} GoogleLatLng
    @typedef {{
        location : GoogleLatLng,
        viewport : LatLngBounds,
    }} AddressGeometry
    @typedef {{
        //a number from 0–6, corresponding to the days of the week, starting on Sunday. For example, 2 means Tuesday.
        day: number,
        //may contain a time of day in 24-hour hhmm format. Values are in the range 0000–2359.
        //The time will be reported in the place's time zone.
        time?: string,
    }} OpeningHoursTime
    @typedef {{
        open: OpeningHoursTime,
        //may contain a pair of day and time objects describing when the place closes.
        //**Note:** If a place is **always open**, the `close` section will be missing from the response.
        //Clients can rely on always-open being represented as an `open` period containing `day` with value 0
        //and `time` with value 0000, and no `close`.
        close?: OpeningHoursTime,
        weekday_text: string[],
    }} OpeningPeriod
    @typedef {{
        open_now: boolean,
        periods?: OpeningPeriod[],
    }} OpeningHours
    @typedef {{
        getUrl: () => string;
        height: number;
        width: number;
        html_attributions: string[];
    }} PlacePhoto
    @typedef {{
        icon: string,
        geometry: AddressGeometry,
        name: string,
        opening_hours?: OpeningHours,
        photos?: PlacePhoto[],
        place_id: string,
        price_level : 0|1|2|3|4,
        rating: number,
        vicinity: string,
        permanently_closed? : true,
    }} NearbySearchItem
    @callback NearbySearchCallback
    @param {NearbySearchItem[]} result
    @param {string|"OK"} status
    @param {{
        hasNextPage : boolean,
        nextPage : () => void,
    }} pagination

    @typedef {{
        location : import("./store").LatLng,
        radius : number,
        type : "restaurant",
        query : "restaurant",
    }} NearbySearchRequest

    @callback GetDetailsCallback
    @param {NearbySearchItem} result
    @param {string|"OK"} status

    @typedef {{
        placeId : string,
        fields? : string[],
    }} GetDetailsRequest

    @typedef {{
        nearbySearch : (
            req : NearbySearchRequest,
            callback : NearbySearchCallback,
        ) => void,
        getDetails : (
            req : GetDetailsRequest,
            callback : GetDetailsCallback,
        ) => void
    }} PlacesServiceInstance

    @callback RouteCallback
    @param {RouteResult} result
    @param {string|"OK"} status

    @typedef {{
        origin : {
            lat : number,
            lng : number,
        },
        destination : {
            lat : number,
            lng : number,
        },
        travelMode : "WALKING"|"BICYCLING"|"DRIVING"|"TRANSIT"
    }} RouteRequest

    @typedef {{
        geocoded_waypoints : {}[],
        request : RouteRequest,
        routes : {
            bounds : LatLngBounds,
            overview_path : GoogleLatLng[],
            legs : {
                distance : { text : string, value : number, },
                duration : { text : string, value : number, },
                end_address : string,
                start_address : string,
                end_location : GoogleLatLng,
                start_location : GoogleLatLng,
                steps : {
                    distance : { text : string, value : number, },
                    duration : { text : string, value : number, },
                    end_location : GoogleLatLng,
                    start_location : GoogleLatLng,
                    instructions : string,
                }[]
            }[]
        }[],
    }} RouteResult

    @typedef {{
        route : (
            req : RouteRequest,
            callback : RouteCallback,
        ) => void
    }} DirectionsServiceInstance

    @typedef {{
        maps : {
            places : {
                PlacesService : { new (map : any) : PlacesServiceInstance }
            },
            DirectionsService : { new () : DirectionsServiceInstance },
            Size : { new (w : number, h : number) : SizeInstance },
            TravelMode : {

            }
        }
    }} GoogleApi
    @typedef {(google : GoogleApi) => void} OnLoadCallback
*/

/** @returns {GoogleApi|undefined} */
function tryGetGoogleApi () {
    return /** @type {any} */(window).google;
}

/** @type {OnLoadCallback[]} */
const pendingCallbacks = [];
/** @type {any} */(window)[callbackName] = () => {
    const googleApi = tryGetGoogleApi();
    if (googleApi === undefined) {
        return;
    }
    for (let onLoad of pendingCallbacks) {
        onLoad(googleApi);
    }
};

let pending = false;
/**
    @param {OnLoadCallback} onLoad
*/
function loadScript (onLoad) {
    pendingCallbacks.push(onLoad);
    if (pending) {
        return;
    }
    pending = true;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}

/**
    @param {OnLoadCallback} onLoad
*/
export function getOrLoad (onLoad) {
    const googleApi = tryGetGoogleApi();
    if (googleApi === undefined) {
        loadScript(onLoad);
    } else {
        onLoad(googleApi);
        return;
    }
}

/**
    @param {any} map
    @param {NearbySearchRequest} req
    @param {NearbySearchCallback} callback
    @returns {{
        cancel : () => void
    }}
*/
export function nearbySearch (map, req, callback) {
    let canceled = false;

    getOrLoad((googleApi) => {
        if (canceled) {
            return;
        }

        const service = new googleApi.maps.places.PlacesService(map);
        console.log("service", service);
        service.nearbySearch(
            req,
            (result, status, pagination) => {
                if (canceled) {
                    return;
                }
                console.log("nearbySearch.result", result);
                console.log("nearbySearch.status", status);
                console.log("nearbySearch.pagination", pagination);
                callback(result, status, pagination);
            }
        );
    });

    return {
        cancel : () => {
            canceled = true;
        },
    };
}

/**
    @param {any} map
    @param {GetDetailsRequest} req
    @param {GetDetailsCallback} callback
    @returns {{
        cancel : () => void
    }}
*/
export function getDetails (map, req, callback) {
    let canceled = false;

    getOrLoad((googleApi) => {
        if (canceled) {
            return;
        }

        const service = new googleApi.maps.places.PlacesService(map);
        console.log("service", service);
        service.getDetails(
            {
                ...req,
                fields : [
                    "icon",
                    "geometry",
                    "name",
                    "opening_hours",
                    "photo",
                    "place_id",
                    "price_level",
                    "rating",
                    "vicinity",
                    "permanently_closed"
                ]
            },
            (result, status) => {
                if (canceled) {
                    return;
                }
                console.log("getDetails.result", result);
                console.log("getDetails.status", status);
                callback(result, status);
            }
        );
    });

    return {
        cancel : () => {
            canceled = true;
        },
    };
}


/**
    @param {RouteRequest} req
    @param {RouteCallback} callback
    @returns {{
        cancel : () => void
    }}
*/
export function route (req, callback) {
    let canceled = false;

    getOrLoad((googleApi) => {
        if (canceled) {
            return;
        }

        const service = new googleApi.maps.DirectionsService();
        console.log("service", service);
        service.route(
            req,
            (result, status) => {
                if (canceled) {
                    return;
                }
                console.log("route.result", result);
                console.log("route.status", status);
                callback(result, status);
            }
        );
    });

    return {
        cancel : () => {
            canceled = true;
        },
    };
}