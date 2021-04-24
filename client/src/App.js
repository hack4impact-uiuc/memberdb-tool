import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import * as Routes from './routes';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Navbar from './components/navbar/Navbar';
import { getUserAuth } from './utils/apiWrapper';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // updates user session on router changes
  useEffect(() => {
    const userAuth = async () => {
      const resp = await getUserAuth();
      if (!resp.error) setUser(resp.data.result);
    };
    userAuth();
  }, [location]);

  return (
    <div>
      {user && <Navbar user={user} />}
      <Switch>
        <Route exact path={Routes.LOGIN_PAGE}>
          {user ? <Redirect to={Routes.DEFAULT} /> : <Login />}
        </Route>
        <Route path={Routes.DEFAULT} exact>
          {user ? <Home user={user} /> : <Redirect to={Routes.LOGIN_PAGE} />}
        </Route>
        <Route path={Routes.MEMBER_PAGE}>
          {/* TODO: Replace this with the users ID once we get real data in the DB */}
          {user ? <Profile /> : <Redirect to={Routes.LOGIN_PAGE} />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
