import * as actions from '../actions/app.actions';

const initialState = {
    user: {
        username: null,
        favorites: []
    },
    authenticated: true,
    token: null,
    distance: 0,
    coordinates: {
        latitude: 45.505724099999995,
        longitude: -73.6995759
    },
    queryMode: 'lookup'
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
        case actions.LOGOUT_SUCCESS: 
            return {
                ...state,
                user: {
                    username: null,
                    favorites: []
                },
                authenticated: false,
                token: null,
                distance: 0,
                coordinates: {
                    latitude: 45.505724099999995,
                    longitude: -73.6995759
                }
            }
        case actions.REGISTER_SUCCESS:
            return {
              ...state,
              user: action.payload.user,
              authenticated: true
            }
        case actions.SET_DISTANCE_SUCCESS:
            return {
                ...state,
                distance: action.payload.distance.distance,
                queryMode: action.payload.distance.queryMode
            }
        case actions.SET_COORDINATES_SUCCESS:
            return {
                ...state,
                coordinates: {
                    latitude: action.payload.latitude,
                    longitude: action.payload.longitude
                }
            }
        case actions.SET_FAVORITES_SUCCESS:

            const current_favorites = state.user.favorites;
            var new_favorites;

            if (current_favorites.length < 5) {
                new_favorites = [...current_favorites, action.payload.favorite.selection]
            }
            else {
                new_favorites = [...current_favorites.slice(1), action.payload.favorite.selection];
            }

            return {
                ...state,
                user: {
                    ...state.user,
                    favorites: new_favorites
                },
                queryMode: action.payload.favorite.queryMode
            }
        default:
            return state;       
    }
};

export default appReducer;
