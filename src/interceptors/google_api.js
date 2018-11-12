import axios from 'axios';

const API_KEY = 'AIzaSyCl2oicdbO4LjkylDN5w6trSvQBdb6-9zo';

const google_api = axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=' + API_KEY, // API_URL
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
});

export default google_api;
