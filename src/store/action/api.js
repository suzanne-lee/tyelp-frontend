import axios from "axios";
import * as config from "../../config";
import {mockApi} from "./mock-api";

const axiosInstance = axios.create({
    baseURL: config.apiBaseUrl
});

/**
    @typedef {import("../reducer/state").Me} Me
    @typedef {import("../reducer/state").Match} Match

    @typedef {{
        emailAddress : string,
        password : string,
        displayName : string,
    }} RegisterArgs

    @typedef {{
        emailAddress : string,
        password : string,
    }} LogInArgs

    @typedef {{
        authenticationToken : string,
    }} MeArgs

    @typedef {{
        placeId : string,
        authenticationToken : string,
        //Should only be used by the mock api
        match : Match,
    }} MatchArgs
*/
const api = {
    /**
        @param {RegisterArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    register : (args) => {
        return axiosInstance.post("/register", args);
    },
    /**
        @param {LogInArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    logIn : (args) => {
        return axiosInstance.post("/login", args);
    },
    /**
        @param {MeArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    me : (args) => {
        return axiosInstance.post(
            "/login",
            {},
            {
                headers : {
                    authorization : args.authenticationToken
                }
            }
        );
    },
    /**
        @param {MatchArgs} args
        @returns {import("axios").AxiosPromise<Match>}
    */
    match : (args) => {
        return axiosInstance.post(
            `/me/place/${encodeURIComponent(args.placeId)}/match`,
            {},
            {
                headers : {
                    authorization : args.authenticationToken
                }
            }
        );
    },
};

const selectedApi = config.useMockApi ?
    mockApi :
    api;
export default selectedApi;