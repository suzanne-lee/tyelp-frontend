import {initialState} from "./state";
import * as cookie from "js-cookie";

/**
    @type {import("./state").Reducer}
*/
export const lngLatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LNGLAT_UPDATE": {
            cookie.set("lastLngLat", JSON.stringify(action.lngLat));
            return {
                ...state,
                lngLat : action.lngLat,
            };
        }
        default: {
            return state;
        }
    }
};