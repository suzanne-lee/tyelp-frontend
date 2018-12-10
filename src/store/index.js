import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import {reducer} from "./reducer";

const enhancers = /** @type {any} */(window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
    @typedef {import("redux").Dispatch<import("./action").Action>} ReduxDispatch
    @typedef {(callback : ThunkCallback) => void} ThunkDispatch

    @callback ThunkCallback
    @param {ReduxDispatch} dispatch

    @type {
        import("redux").Store<
            import("./reducer/state").State,
            import("./action").Action
        > &
        {
            dispatch : ThunkDispatch
        }
    }
*/
const store = createStore(
    reducer,
    enhancers(applyMiddleware(thunk))
);

export default store;

/**
    @typedef {import("./reducer/state").Place} Place
    @typedef {import("./reducer/state").Match} Match
    @typedef {import("./reducer/state").Me} Me
    @typedef {import("./reducer/state").LatLng} LatLng
    @typedef {import("./reducer/state").ErrorMessageCollection} ErrorMessageCollection
    @typedef {import("./reducer/state").State} State

*/