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
                currentMatch : action.match,
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
        case "MATCH_SELECTED": {
            return {
                ...state,
                currentMatch : {
                    placeId : action.placeId
                },
            };
        }
        default: {
            return state;
        }
    }
};