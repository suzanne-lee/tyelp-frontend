import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './reducers/app.reducer';

const rootReducer = combineReducers(
    {
        app: appReducer
    }
); 

const enhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Store = createStore(
    rootReducer,
    enhancers(applyMiddleware(thunk))
);

export default Store; 
