import axios from "axios";
import * as config from "../../config";

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
function randomRating () {
    return 1 + Math.random() * 4;
}
function randomPriceLevel () {
    return /** @type {0|1|2|3|4} */(Math.floor(Math.random() * 5));
}
const mockApi = {
    /**
        @param {RegisterArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    register : (args) => {
        return Promise.resolve({
            status : 200,
            statusText : "OK",
            headers : {},
            config : {},
            data : {
                displayName: args.displayName,
                authenticationToken: btoa(`${args.emailAddress}:${args.password}`),
                matches: [
                    {
                        placeId : "ChIJN1t_tDeuEmsRUsoyG83frY4",
                        name : "Mock Place",
                        rating : randomRating(),
                        price_level : randomPriceLevel(),
                        vicinity : "Mock Vicinity",
                        matchedAt : new Date("2018-06-14 14:30:67"),
                    }
                ],
            }
        });
    },
    /**
        @param {LogInArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    logIn : (args) => {
        return Promise.resolve({
            status : 200,
            statusText : "OK",
            headers : {},
            config : {},
            data : {
                displayName: "Mock Me",
                authenticationToken: btoa(`${args.emailAddress}:${args.password}`),
                matches: [
                    {
                        placeId : "ChIJN1t_tDeuEmsRUsoyG83frY4",
                        name : "Mock Place",
                        rating : randomRating(),
                        price_level : randomPriceLevel(),
                        vicinity : "Mock Vicinity",
                        matchedAt : new Date("2018-06-14 14:30:67"),
                    }
                ],
            }
        });
    },
    /**
        @param {MeArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    me : (args) => {
        return Promise.resolve({
            status : 200,
            statusText : "OK",
            headers : {},
            config : {},
            data : {
                displayName: "Mock Me",
                authenticationToken: args.authenticationToken,
                matches: [
                    {
                        placeId : "ChIJN1t_tDeuEmsRUsoyG83frY4",
                        name : "Mock Place",
                        rating : randomRating(),
                        price_level : randomPriceLevel(),
                        vicinity : "Mock Vicinity",
                        matchedAt : new Date("2018-06-14 14:30:67"),
                    }
                ],
            }
        });
    },
    /**
        @param {MatchArgs} args
        @returns {import("axios").AxiosPromise<Match>}
    */
    match : (args) => {
        return Promise.resolve({
            status : 200,
            statusText : "OK",
            headers : {},
            config : {},
            data : {
                placeId : args.placeId,
                name : `Place ${args.placeId}`,
                rating : randomRating(),
                price_level : randomPriceLevel(),
                vicinity : `Vicinity ${args.placeId}`,
                matchedAt : new Date(),
            }
        });
    },
};
const selectedApi = config.useMockApi ?
    mockApi :
    api;
export default selectedApi;