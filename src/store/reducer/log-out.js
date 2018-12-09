import {initialState} from "./state";
import * as cookie from "js-cookie";

/**
    @type {import("./state").Reducer}
*/
export const logOutReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOG_OUT_SUCCESS": {
            cookie.remove("authenticationToken");
            return {
                ...state,
                me : undefined,
            };
        }
        default: {
            return state;
        }
    }
};