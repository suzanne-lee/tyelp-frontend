import {initialState} from "./state";

/**
    @type {import("./state").Reducer}
*/
export const meReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ME_SUCCESS": {
            return {
                ...state,
                me : action.me,
            };
        }
        case "ME_FAIL": {
            return {
                ...state,
                errorMessages : {
                    ...state.errorMessages,
                    me : action.errorMessage,
                },
            };
        }
        default: {
            return state;
        }
    }
};