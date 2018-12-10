/**
    @typedef Place
    @property {string} placeId - The identifier of the place
    @property {string} name - The human-readable name of the place
    @property {number} rating - [1.0, 5.0] based on aggregated user reviews
    @property {0|1|2|3|4} priceLevel - 0 is free, 4 is very expensive
    @property {string} vicinity - The simplified address of the place

    @typedef {Place & { matchedAt : Date }} Match

    @typedef Me
    @property {string} displayName
    @property {string} authenticationToken
    @property {Match[]} matches

    @typedef LatLng
    @property {number} lat
    @property {number} lng

    @typedef {{
        logIn? : string,
        match? : string,
        me? : string,
        register? : string,
    }} ErrorMessageCollection

    @typedef State
    @property {Me|undefined} me
    @property {ErrorMessageCollection} errorMessages
    @property {LatLng|undefined} latLng
    @property {{ placeId : string }|undefined} currentMatch
*/

/** @type State */
export const initialState = {
    me: undefined,
    errorMessages : {},
    latLng: undefined,
    currentMatch : undefined,
};

/**
    @typedef {
        import("redux").Reducer<
            import("./state").State,
            import("../action").Action
        >
    } Reducer
*/