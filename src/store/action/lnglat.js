/**
    @typedef LngLatUpdateAction
    @property {"LNGLAT_UPDATE"} type
    @property {import("../reducer/state").LngLat} lngLat
*/

/**
    @param {import("../reducer/state").LngLat} args
    @returns {LngLatUpdateAction}
*/
export const LNGLAT_UPDATE = (args) => {
    return {
        type : "LNGLAT_UPDATE",
        lngLat : args,
    };
};