import {initialState} from "./state";
import * as cookie from "js-cookie";

/**
    @type {import("./state").Reducer}
*/
export const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REGISTER_SUCCESS": {
            cookie.set("authenticationToken", action.me.authenticationToken);
            return {
                ...state,
                me : action.me,
            };
        }
        case "REGISTER_FAIL": {
            return {
                ...state,
                errorMessages : {
                    ...state.errorMessages,
                    register : action.errorMessage,
                },
            };
        }
        default: {
            return state;
        }
    }
};