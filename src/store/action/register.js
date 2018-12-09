import api from "./api";

/**
    @typedef RegisterSuccessAction
    @property {"REGISTER_SUCCESS"} type
    @property {import("../reducer/state").Me} me

    @typedef RegisterFailAction
    @property {"REGISTER_FAIL"} type
    @property {string} errorMessage
*/

/**
    @param {import("./api").RegisterArgs} args
    @returns {import("../").ThunkCallback}
*/
export const REGISTER_ACTION = (args) => {
    return (dispatch) => {
        api.register(args)
            .then((response) => {
                dispatch(REGISTER_ACTION_SUCCESS(response.data));
            })
            .catch(function (err) {
                dispatch(REGISTER_ACTION_FAIL(err.message));
            });
    };
}

/**
    @param {import("../reducer/state").Me} me
    @returns {RegisterSuccessAction}
*/
export const REGISTER_ACTION_SUCCESS = (me) => {
    return {
        type: "REGISTER_SUCCESS",
        me,
    };
}

/**
    @param {string} errorMessage
    @returns {RegisterFailAction}
*/
export const REGISTER_ACTION_FAIL = (errorMessage) => {
    return {
        type: "REGISTER_FAIL",
        errorMessage,
    };
}
