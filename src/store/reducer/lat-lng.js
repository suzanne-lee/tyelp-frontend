import {initialState} from "./state";
import * as cookie from "js-cookie";

/**
    @type {import("./state").Reducer}
*/
export const latLngReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LAT_LNG_UPDATE": {
            cookie.set("lastLatLng", JSON.stringify(action.latLng));
            return {
                ...state,
                latLng : action.latLng,
            };
        }
        default: {
            return state;
        }
    }
};