import React, { Component } from 'react';

/**
 * Lazy load async function
 */

const async = (calledComponent) => {
    return class extends Component {

        state = {
            component: null
        }

        componentDidMount () {
            calledComponent()
                .then(
                    (val) => {
                        this.setState({
                            component: val.default
                        });
                    }
                );
        }

        render () {
            const C = this.state.component;
            return C? <C { ...this.props } /> : null;
        }
    }
};

export default async;
