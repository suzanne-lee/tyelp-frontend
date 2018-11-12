import * as actions from '../actions/app.actions';

const initialState = {
    user: null,
    authenticated: false,
    token: null,
    restaurants: []
}

const appReducer = (state = initialState, action) => {
    
    switch (action.type) 
    {
        case actions.SET_TOKEN_SUCCESS:
            return {
                ...state,
                token: action.payload.token
            }
        case actions.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                authenticated: true
            }
        case actions.GET_RESTAURANTS_SUCCESS:
            return {
                ...state,
                restaurants: action.payload.restaurants
            }
        default:
            return state;       
    }
};

export default appReducer;
