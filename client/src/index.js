import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import * as Routes from './routes';

import Home from './pages/Home';
import Member from './pages/Member';

import Navbar from './components/navbar/Navbar';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div className='App'>
        <Navbar />
        <Switch>
          <Route exact path={Routes.DEFAULT_ROUTE} component={Home} />
          <Route path={Routes.MEMBER_PAGE_ROUTE} component={Member} />
        </Switch>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
