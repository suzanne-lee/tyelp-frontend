import api from "./api";

/**
    @typedef MeSuccessAction
    @property {"ME_SUCCESS"} type
    @property {import("../reducer/state").Me} me

    @typedef MeFailAction
    @property {"ME_FAIL"} type
    @property {string} errorMessage
*/

/**
    @param {import("./api").MeArgs} args
    @returns {import("../").ThunkCallback}
*/
export const ME_ACTION = (args) => {
    return (dispatch) => {
        api.me(args)
            .then((response) => {
                dispatch(ME_ACTION_SUCCESS(response.data));
            })
            .catch(function (err) {
                dispatch(ME_ACTION_FAIL(err.message));
            });
    };
}

/**
    @param {import("../reducer/state").Me} me
    @returns {MeSuccessAction}
*/
export const ME_ACTION_SUCCESS = (me) => {
    return {
        type: "ME_SUCCESS",
        me,
    };
}

/**
    @param {string} errorMessage
    @returns {MeFailAction}
*/
export const ME_ACTION_FAIL = (errorMessage) => {
    return {
        type: "ME_FAIL",
        errorMessage,
    };
}
