import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import * as Routes from './routes';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Note from './pages/Note';
import Notes from './pages/Notes';
import Chapters from './pages/Chapters';
import Projects from './pages/Projects';
import Navbar from './components/navbar/Navbar';
import PrivateRoute from './components/routes/PrivateRoute';
import NotFound from './pages/NotFound';
import { getUserAuth } from './utils/apiWrapper';
import './css/App.css';

const App = () => {
  const [user, setUser] = useState({firstName: '', lastName: '', email: '', level: '', _id: '' });
  const location = useLocation();

  // updates user session on router changes
  useEffect(() => {
    const userAuth = async () => {
      const resp = await getUserAuth();
      if (!resp.error) setUser(resp?.data?.result);
    };
    userAuth();
  }, [location]);

  // TODO: Create user context and remove prop drilling

  return (
    <div className="app-container">
      {user && <Navbar user={user} />}
      <Switch>
        <Route exact path={Routes.LOGIN_PAGE}>
          {user._id ? <Redirect to={Routes.DEFAULT} /> : <Login />}
        </Route>
        <Route path={Routes.PROJECTS}>
          {user._id ? <Projects /> : <Redirect to={Routes.LOGIN_PAGE} />}
        </Route>
        <Route path={Routes.MEMBER_PAGE}>
          <Switch>
            <Route path={Routes.NOTE_PAGE}>
              {user._id && <Note user={user} />}
            </Route>
            <Route>
              {user._id ? <Profile /> : <Redirect to={Routes.LOGIN_PAGE} />}
            </Route>
          </Switch>
        </Route>
        <Route path={Routes.CHAPTERS}>
          {user._id ? <Chapters /> : <Redirect to={Routes.LOGIN_PAGE} />}
        </Route>
        <PrivateRoute
          path={Routes.NOTE_PAGE}
          authed={!!user._id}
          component={<Note user={user} />}
        />
        <PrivateRoute
          path={Routes.NOTES}
          authed={!!user._id}
          component={<Notes />}
        />
        <Route exact path={Routes.DEFAULT}>
          {user._id ? <Home/> : <Login />}
        </Route>
        <Route exact path={Routes.NOT_FOUND}>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
};

export default App;