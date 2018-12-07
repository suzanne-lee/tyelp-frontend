import axios from 'axios';
import * as config from "./axios.config";
/**
 * AXIOS Interceptors:
 * 1. Default API url
 * 2. Authorization token
 * 3. Request
 * 4. Response
 */

const instance = axios.create({
  baseURL: config.baseUrl
});
/*
    body : {
        username : string,
        password : string,
        firstName : string,
        lastName : string,
    }
    response : undefined
    expectedStatusCode : 202
*/
instance.register = (body) => {
  return instance.post("/register", body);
};
/*
    body : {
        username : string,
        password : string,
    }
    response : number
    expectedStatusCode : 200
    It looks like the response is the user's id...
    TODO Return an actual authentication token?
    TODO Return the user's firstName and lastName?
*/
instance.logIn = (body) => {
  return instance.post("/login", body);
};
/*
    body : {
        //TODO Make this an actual authentication token
        //and have it in the header?
        user_id : number,
        place_id : string,
    }
    response : undefined
    expectedStatusCode : 202
*/
instance.addPlaceToHistory = (body) => {
  return instance.post("/history", body);
};
//TODO ?
instance.fetchAllHistory = (body) => {

};

instance.defaults.headers.common['Authorization'] = '';

instance.interceptors.request.use(
  (req) => {

    // Edit request

    return req;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {

    // Edit response

    return res;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default instance;