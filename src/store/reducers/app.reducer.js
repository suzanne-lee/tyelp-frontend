import * as actions from '../actions/app.actions';

const initialState = {
    authenticated: false,
    token: null
}

const appReducer = (state = initialState, action) => {

    switch (action.type) 
    {
        case actions.SET_TOKEN_ACTION_SUCCESS:
            return {
                token: action.payload.token,
                ...state
            }
        default:
            return state;       
    }
};

export default appReducer;
