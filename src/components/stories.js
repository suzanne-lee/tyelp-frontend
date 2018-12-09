//TODO Refactor
import React, { Component } from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import store from '../store';
import Story from './story';
import * as path from "../path";

/**
    @typedef {{ me : undefined|import("../store").Me }} StoriesProps
    @typedef {{ goBack : boolean }} StoriesState

    @extends {Component<StoriesProps>}
*/
class Stories extends Component {
    /** @param {StoriesProps} props */
    constructor(props) {
        super(props);

        /** @type {StoriesState} */
        this.state = {
            goBack : false,
        };
    }

    goBack = () => {
        this.setState({
            goBack : true,
        });
    };

    render() {
        if (this.props.me == undefined) {
            return (<Redirect to={path.logIn}/>);
        }
        if (this.state.goBack) {
            return (<Redirect to={path.nearby}/>)
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="stories-container">
                        {
                            this.props.me.matches.map(
                                (item, i) => <Story key = {i} item = {item}/>
                            )
                        }

                        <button type="button" className="btn btn-dark btn-lg" onClick={this.goBack}>
                            BACK
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

/**
    @param {import("../store").State} state
    @returns {StoriesProps}
*/
function mapStateToProps (state) {
    return {
        me: state.me,
    };
};
export default connect(mapStateToProps)(Stories);
