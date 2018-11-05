import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div className="App">
          Starter project
        </div>
      </Provider>
    );
  }
}

export default App;
