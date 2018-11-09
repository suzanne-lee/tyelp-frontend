import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
// import UI from './components/ui';
import Stories from './components/stories';
import Error from './components/error';
import async from './hoc/async';
// import * as actions from './store/actions/app.actions';
import './App.css';

const AsyncUI = async(
  () => {
    return import('./components/ui');
  }
);

class App extends Component {

  state = {
    authenticated: false,
    token: null
  }

  render() {
    return (
      <BrowserRouter /* basename=''*/>
        <Switch>
          <Route path='/' exact component={ Home } /> 
          <Route path='/login' component={ Login } />
          <Route path='/stories' component={ Stories } />
          { this.state.authenticated?  <Route path='/ui' component={ AsyncUI } /> : null }
          <Route path='/error' component={ Error } />
          <Redirect from='/' to='/login'/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
