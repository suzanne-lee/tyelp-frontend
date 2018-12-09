import {initialState} from "./state";
import * as cookie from "js-cookie";

/**
    @type {import("./state").Reducer}
*/
export const logInReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOG_IN_SUCCESS": {
            cookie.set("authenticationToken", action.me.authenticationToken);
            return {
                ...state,
                me : action.me,
            };
        }
        case "LOG_IN_FAIL": {
            return {
                ...state,
                errorMessages : {
                    ...state.errorMessages,
                    logIn : action.errorMessage,
                },
            };
        }
        default: {
            return state;
        }
    }
};