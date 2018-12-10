import * as cookie from "js-cookie";
/**
    @typedef {import("../reducer/state").Me} Me
    @typedef {import("../reducer/state").Match} Match

    @typedef {import("./api").RegisterArgs} RegisterArgs
    @typedef {import("./api").LogInArgs} LogInArgs
    @typedef {import("./api").MeArgs} MeArgs
    @typedef {import("./api").MatchArgs} MatchArgs
*/

/**
    @param {string} emailAddress
    @returns {boolean}
*/
function mockUserExists (emailAddress) {
    return cookie.get(`MockUserEmail-${emailAddress}`) !== undefined;
}
/**
    @param {string} authenticationToken
    @returns {Me}
*/
function getMockUser (authenticationToken) {
    const mockUser = cookie.get(`MockUser-${authenticationToken}`);
    if (mockUser === undefined) {
        throw new Error(`Invalid email address or password`);
    } else {
        return JSON.parse(mockUser);
    }
}
/**
    @param {RegisterArgs} args
    @returns {Me}
*/
function registerMockUser (args) {
    const authenticationToken = btoa(`${args.emailAddress}:${args.password}`);
    if (mockUserExists(args.emailAddress)) {
        throw new Error(`User already exists`);
    } else {
        /** @type {Me} */
        const me = {
            displayName: args.displayName,
            authenticationToken,
            matches: [],
        };
        cookie.set(`MockUser-${authenticationToken}`, JSON.stringify(me));
        cookie.set(`MockUserEmail-${args.emailAddress}`, "true");
        return me;
    }
}
/**
    @param {LogInArgs} args
    @returns {Me}
*/
function logInMockUser (args) {
    const authenticationToken = btoa(`${args.emailAddress}:${args.password}`);
    return getMockUser(authenticationToken);
}
/**
    @param {MatchArgs} args
    @returns {Match}
*/
function mockMatch (args) {
    const me = getMockUser(args.authenticationToken);
    if (me.matches.some(m => m.placeId === args.placeId)) {
        throw new Error(`Already matched`);
    }
    me.matches.push(args.match);
    cookie.set(`MockUser-${args.authenticationToken}`, JSON.stringify(me));
    return args.match;
}

export const mockApi = {
    /**
        @param {RegisterArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    register : (args) => {
        return new Promise((resolve) => {
            resolve({
                status : 200,
                statusText : "OK",
                headers : {},
                config : {},
                data : registerMockUser(args),
            });
        });
    },
    /**
        @param {LogInArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    logIn : (args) => {
        return new Promise((resolve) => {
            resolve({
                status : 200,
                statusText : "OK",
                headers : {},
                config : {},
                data : logInMockUser(args),
            });
        });
    },
    /**
        @param {MeArgs} args
        @returns {import("axios").AxiosPromise<Me>}
    */
    me : (args) => {
        return new Promise((resolve) => {
            resolve({
                status : 200,
                statusText : "OK",
                headers : {},
                config : {},
                data : getMockUser(args.authenticationToken),
            });
        });
    },
    /**
        @param {MatchArgs} args
        @returns {import("axios").AxiosPromise<Match>}
    */
    match : (args) => {
        return new Promise((resolve) => {
            resolve({
                status : 200,
                statusText : "OK",
                headers : {},
                config : {},
                data : mockMatch(args),
            });
        });
    },
};