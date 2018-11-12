import google_api from '../../interceptors/google_api';

/**
 * Application Actions
 */

export const SET_TOKEN = 'SET_TOKEN';
export const SET_TOKEN_SUCCESS = 'SET_TOKEN_SUCCESS';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const GET_RESTAURANTS = 'GET_RESTAURANTS';
export const GET_RESTAURANTS_SUCCESS = 'GET_RESTAURANTS_SUCCESS';
 
/**
 * Application Action Creators
 */

export const SET_TOKEN_ACTION = () => {
    
    let token = null;
    // asynchronous call using axios instance
    
    return (dispatch /* getState */) => { // second argument to access redux state if needed
        dispatch(SET_TOKEN_ACTION_SUCCESS(token));
    };
};

export const SET_TOKEN_ACTION_SUCCESS = (token) => {
    return {
        type: SET_TOKEN_SUCCESS,
        payload: {
            token: token
        }
    }
};

export const LOGIN_ACTION = (username,password) => {

    let user = null;
    // asynchronous call using axios instance

    return (dispatch) => { 
        dispatch(LOGIN_SUCCESS(user));
    };
}

export const LOGIN_SUCCESS_ACTION = (user) => {
    return {
        type: LOGIN_SUCCESS,
        payload: {
            user: user
        }
    }
}

export const GET_RESTAURANTS_ACTION = (distance) => {
    
    let list = ['Error'];

    google_api.get()
        .then(
            (res) => {
                console.log(res);
                list = res.results;

                return (dispatch) => { 
                    dispatch(GET_RESTAURANTS_ACTION_SUCCESS(list));
                };
            }
        )
        .catch(
            (err) => {
                console.log(err);
            }
        );  
    

    return (dispatch) => { 
        dispatch(GET_RESTAURANTS_ACTION_SUCCESS(list));
    };
};

export const GET_RESTAURANTS_ACTION_SUCCESS = (restaurants) => {
    return {
        type: GET_RESTAURANTS_SUCCESS,
        payload: {
            restaurants: restaurants
        }
    }
};
