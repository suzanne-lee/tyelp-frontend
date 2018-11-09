import axios from 'axios';

/**
 * AXIOS Interceptors:
 * 1. Default API url
 * 2. Authorization token
 * 3. Request
 * 4. Response
 */

const instance = axios.create({
    baseURL: '' // API_URL
});

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
