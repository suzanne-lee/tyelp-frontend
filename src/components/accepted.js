import React, { Component } from 'react';
import '../styles/accepted.css';

class Accepted extends Component {
    
    leave = () =>
    {
        this.props.history.push({ pathname: '/login' });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="accepted-ctn">
                        <label>
                            OK :)
                        </label>
                        <button type="button" className="btn btn-dark btn-lg" onClick={ this.leave }>
                            LEAVE
                        </button>
                    </div>   
                </div>
            </div>
        );
    }
}

export default Accepted;
