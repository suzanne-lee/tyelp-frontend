import {initialState} from "./state";
import {latLngReducer} from "./lat-lng";
import {logInReducer} from "./log-in";
import {logOutReducer} from "./log-out";
import {matchReducer} from "./match";
import {meReducer} from "./me";
import {registerReducer} from "./register";

const reducers = [
    latLngReducer,
    logInReducer,
    logOutReducer,
    matchReducer,
    meReducer,
    registerReducer,
];
/**
    @type {import("./state").Reducer}
*/
export const reducer = (state = initialState, action) => {
    for (let reducer of reducers) {
        const nextState = reducer(state, action);
        if (nextState !== state) {
            return nextState;
        }
    }
    return state;
};