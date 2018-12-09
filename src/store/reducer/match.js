import {initialState} from "./state";

/**
    @type {import("./state").Reducer}
*/
export const matchReducer = (state = initialState, action) => {
    switch (action.type) {
        case "MATCH_SUCCESS": {
            if (state.me === undefined) {
                return state;
            }
            return {
                ...state,
                me : {
                    ...state.me,
                    matches : [...state.me.matches, action.match],
                },
            };
        }
        case "MATCH_FAIL": {
            return {
                ...state,
                errorMessages : {
                    ...state.errorMessages,
                    match : action.errorMessage,
                },
            };
        }
        default: {
            return state;
        }
    }
};