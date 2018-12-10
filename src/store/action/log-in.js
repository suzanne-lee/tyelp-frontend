import api from "./api";

/**
    @typedef LogInSuccessAction
    @property {"LOG_IN_SUCCESS"} type
    @property {import("../reducer/state").Me} me

    @typedef LogInFailAction
    @property {"LOG_IN_FAIL"} type
    @property {string} errorMessage
*/

/**
    @param {import("./api").LogInArgs} args
    @returns {import("..").ThunkCallback}
*/
export const LOG_IN_ACTION = (args) => {
    return (dispatch) => {
        api.logIn(args)
            .then((response) => {
                dispatch(LOG_IN_ACTION_SUCCESS(response.data));
            })
            .catch(function (err) {
                dispatch(LOG_IN_ACTION_FAIL(err.message));
            });
    };
}

/**
    @param {import("../reducer/state").Me} me
    @returns {LogInSuccessAction}
*/
export const LOG_IN_ACTION_SUCCESS = (me) => {
    return {
        type: "LOG_IN_SUCCESS",
        me,
    }
}

/**
    @param {string} errorMessage
    @returns {LogInFailAction}
*/
export const LOG_IN_ACTION_FAIL = (errorMessage) => {
    return {
        type: "LOG_IN_FAIL",
        errorMessage,
    };
}
