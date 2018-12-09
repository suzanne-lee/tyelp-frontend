import React, {Component} from 'react';

/**
    @typedef {{ new(...args:any[]) : Component }} ComponentClass

    Lazy load async function
    @param {() => Promise<{ default : ComponentClass }>} importComponent
*/
const async = (importComponent) => {
    class AsyncComponent extends Component {
        /** @type {{ component : undefined|ComponentClass }} */
        state = {
            component : undefined
        };

        componentDidMount () {
            importComponent().then((result) => {
                this.setState({
                    component: result.default
                });
            });
        }

        render () {
            const C = (this.state.component);
            return (C === undefined) ?
                null :
                <C { ...this.props } />;
        }
    };
    return AsyncComponent;
};

export default async;
