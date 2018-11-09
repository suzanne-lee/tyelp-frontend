export const SET_TOKEN = 'SET_TOKEN';
export const SET_TOKEN_SUCCESS = 'SET_TOKEN_SUCCESS';
 
export const SET_TOKEN_ACTION = (tk) => {
    
    // asynchronous call using axios instance
    
    return (dispatch, /* getState */) => { // second argument to access redux state if needed
        dispatch(SET_TOKEN_ACTION_SUCCESS(tk));
    };
};

export const SET_TOKEN_ACTION_SUCCESS = (tk) => {
    return {
        type: SET_TOKEN,
        payload: {
            token: tk
        }
    }
};
