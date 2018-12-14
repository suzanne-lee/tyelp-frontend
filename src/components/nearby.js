import React, { Component } from 'react';
import {connect} from "react-redux";
import * as actions from '../store/action';
import Map from './map';
import '../styles/query.css';

/**
    @typedef {{
        latLng : undefined|import("../store").LatLng,
        me : undefined|import("../store").Me,
        currentMatch : undefined|{ placeId : string },
    }} NearbyStateProps
    @typedef {{
        match : (args : import("../store/action").MatchArgs) => void
        matchSelected : (args : { placeId : string }) => void
    }} NearbyDispatchProps
    @typedef {NearbyStateProps & NearbyDispatchProps} NearbyProps
    @typedef {{}} NearbyState

    @extends {Component<NearbyProps, NearbyState>}
*/
class Nearby extends Component {
    /** @param {any} props */
    constructor(props) {
        super(props);

        this.state = {};
    }


    render() {
        return (
            <div className="container">
                <Map
                    center={this.props.latLng}
                    onMatch={(match) => {
                        if (this.props.me === undefined) {
                            return;
                        }
                        console.log("Match", match);
                        this.props.match({
                            placeId : match.placeId,
                            authenticationToken : this.props.me.authenticationToken,
                            match : match,
                        });
                    }}
                    onMatchSelected={({placeId}) => {
                        this.props.matchSelected({
                            placeId
                        });
                    }}
                    currentMatch={this.props.currentMatch}
                    matches={
                        this.props.me === undefined ?
                        [] :
                        this.props.me.matches
                    }
                />
            </div>
        );
    }
}


/**
    @param {import("../store").State} state
    @returns {NearbyStateProps}
*/
function mapStateToProps (state) {
    return {
        latLng: state.latLng,
        me : state.me,
        currentMatch : state.currentMatch,
    };
};

/**
    @param {import("../store").ThunkDispatch} dispatch
    @returns {NearbyDispatchProps}
*/
function mapDispatchToProps (dispatch) {
    return {
        match : (args) => {
            dispatch(actions.MATCH_ACTION(args));
        },
        matchSelected : (args) => {
            dispatch(actions.MATCH_SELECTED_ACTION(args));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Nearby);
