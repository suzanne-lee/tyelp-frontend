/**
    @typedef LatLngUpdateAction
    @property {"LAT_LNG_UPDATE"} type
    @property {import("../reducer/state").LatLng} latLng
*/

/**
    @param {import("../reducer/state").LatLng} args
    @returns {LatLngUpdateAction}
*/
export const LAT_LNG_UPDATE = (args) => {
    return {
        type : "LAT_LNG_UPDATE",
        latLng : args,
    };
};