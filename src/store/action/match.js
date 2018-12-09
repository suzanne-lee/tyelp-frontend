import api from "./api";

/**
    @typedef MatchSuccessAction
    @property {"MATCH_SUCCESS"} type
    @property {import("../reducer/state").Match} match

    @typedef MatchFailAction
    @property {"MATCH_FAIL"} type
    @property {string} errorMessage
*/

/**
    @param {import("./api").MatchArgs} args
    @returns {import("../").ThunkCallback}
*/
export const MATCH_ACTION = (args) => {
    return (dispatch) => {
        api.match(args)
            .then((response) => {
                dispatch(MATCH_ACTION_SUCCESS(response.data));
            })
            .catch(function (err) {
                dispatch(MATCH_ACTION_FAIL(err.message));
            });
    };
}

/**
    @param {import("../reducer/state").Match} match
    @returns {MatchSuccessAction}
*/
export const MATCH_ACTION_SUCCESS = (match) => {
    return {
        type: "MATCH_SUCCESS",
        match,
    };
}

/**
    @param {string} errorMessage
    @returns {MatchFailAction}
*/
export const MATCH_ACTION_FAIL = (errorMessage) => {
    return {
        type: "MATCH_FAIL",
        errorMessage,
    };
}
