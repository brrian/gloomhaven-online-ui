import 'mobx-react-lite/batchingForReactDom';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import { SESSION_PAGE } from './constants';
import Session from './features/session/Session';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { StoreContextProvider } from './store';

ReactDOM.render(
  <React.StrictMode>
    <StoreContextProvider>
      <Router>
        <Switch>
          <Route path={`/${SESSION_PAGE}/:id`}>
            <Session />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    </StoreContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
