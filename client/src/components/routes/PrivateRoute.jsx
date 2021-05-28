// @flow
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

import * as Routes from '../../routes';

type PrivateRouteProp = {
  path: string,
  authed: boolean,
  component: Object,
};

const PrivateRoute = ({ path, authed, component }: PrivateRouteProp) =>
  authed ? (
    <Route path={path}>{component}</Route>
  ) : (
    <Redirect to={Routes.LOGIN_PAGE} />
  );

export default PrivateRoute;
