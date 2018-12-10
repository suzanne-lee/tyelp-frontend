import React from 'react';
import ReactDOM from '../../../.cache/typescript/2.9/node_modules/@types/react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
