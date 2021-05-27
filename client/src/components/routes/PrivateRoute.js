import * as React from 'react';
import * as Routes from '../../routes';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({path, authed , component}) => {
  console.log("hi");
  return authed ? (
    <Route path={path} exact component={component} />
  ) : (
    <Redirect to={Routes.LOGIN_PAGE} />
  );
};

export default PrivateRoute;