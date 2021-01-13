import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import * as Routes from './routes';

import Home from './pages/Home';
import Member from './pages/Member';
import Login from './pages/Login';

import Navbar from './components/navbar/Navbar';

import {
  endUserSession,
  getUserAuth,
  startUserSession,
} from './utils/apiWrapper';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userAuth = async () => {
      const resp = await getUserAuth();
      if (!resp.error) setIsAuthenticated(resp.data.result);
    };
    userAuth();
  }, []);

  const login = () => {
    const startSession = async () => {
      const resp = await startUserSession();
      if (!resp.error) setIsAuthenticated(true);
    };

    // TODO: remove unnecessary line after backend is connected properly
    setIsAuthenticated(true);

    startSession();
  };

  const logout = () => {
    const endSession = async () => {
      const resp = await endUserSession();
      if (!resp.error) setIsAuthenticated(false);
    };

    // TODO: remove unnecessary line after backend is connected properly
    setIsAuthenticated(false);

    endSession();
  };

  return (
    <div className="App">
      <Router>
        <Navbar logout={logout} />
        <Switch>
          <Route exact path="/login">
            {isAuthenticated ? (
              <Redirect to={Routes.DEFAULT_ROUTE} />
            ) : (
              <Login login={login} />
            )}
          </Route>
          <Route path={Routes.DEFAULT_ROUTE} exact>
            {isAuthenticated ? <Home /> : <Redirect to="/login" />}
          </Route>
          <Route path={Routes.MEMBER_PAGE_ROUTE} exact>
            {isAuthenticated ? <Member /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
