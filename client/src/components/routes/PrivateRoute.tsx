// @flow
import React from 'react';
import { ReactElement } from 'react';
import { Route, Redirect } from 'react-router-dom';

import * as Routes from '../../routes';

type PrivateRouteProp = {
  path: string,
  authed: boolean,
  component: Object,
};

const PrivateRoute = ({ path, authed, component }: PrivateRouteProp): ReactElement =>
  authed ? (
    <Route exact path={path}>
      {component}
    </Route>
  ) : (
    <Redirect to={Routes.LOGIN_PAGE} />
  );

export default PrivateRoute;
