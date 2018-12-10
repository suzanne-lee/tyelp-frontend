import React, {Component} from 'react';
import {connect} from "react-redux";
import {PlaceCard} from './place-card';
import * as actions from '../store/action';
import * as path from "../path";
import {Link} from "react-router-dom";

/**
    @typedef {{ me : undefined|import("../store").Me }} MatchesStateProps
    @typedef {{
        matchSelected : (args : { placeId : string }) => void
    }} MatchesDispatchProps
    @typedef {MatchesStateProps & MatchesDispatchProps} MatchesProps

    @typedef {{}} MatchesState

    @extends {Component<MatchesProps>}
*/
class Matches extends Component {
    /** @param {MatchesProps} props */
    constructor(props) {
        super(props);

        /** @type {MatchesState} */
        this.state = {};
    }
    render() {
        if (this.props.me == undefined) {
            return null;
        }
        const matches = this.props.me.matches;
        if (matches.length === 0) {
            return (
                <div className="container">
                    <div className="alert alert-primary" role="alert">
                        Looks like you have no matches yet!
                        <br/>
                        Click <Link to={path.nearby}>here</Link> to find restaurants near you!
                    </div>
                </div>
            );
        }
        return (
            <div className="container">
                <div className="row">
                    {
                        this.props.me.matches.map((item) => {
                            return (
                                <PlaceCard
                                    singleLine
                                    className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12"
                                    item={{
                                        place_id : item.placeId,
                                        name : item.name,
                                        rating : item.rating,
                                        price_level : item.priceLevel,
                                        vicinity : item.vicinity,

                                        icon : null,
                                        opening_hours : null,
                                        photos : null,
                                    }}
                                    matches={matches}
                                >
                                    <Link
                                        className="btn btn-outline-info btn-lg float-right"
                                        style={{ width : "75px" }}
                                        onClick={() => {
                                            this.props.matchSelected({
                                                placeId : item.placeId,
                                            });
                                        }}
                                        to={path.nearby}
                                    >
                                        <i className="fas fa-directions"></i>
                                    </Link>
                                </PlaceCard>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

/**
    @param {import("../store").State} state
    @returns {MatchesStateProps}
*/
function mapStateToProps (state) {
    return {
        me: state.me,
    };
};

/**
    @param {import("../store").ThunkDispatch} dispatch
    @returns {MatchesDispatchProps}
*/
function mapDispatchToProps (dispatch) {
    return {
        matchSelected : (args) => {
            dispatch(actions.MATCH_SELECTED_ACTION(args));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Matches);
