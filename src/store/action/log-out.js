/**
    @typedef LogOutSuccessAction
    @property {"LOG_OUT_SUCCESS"} type
*/

/**
    @returns {LogOutSuccessAction}
*/
export const LOG_OUT_ACTION_SUCCESS = () => {
    return {
        type: "LOG_OUT_SUCCESS"
    }
}