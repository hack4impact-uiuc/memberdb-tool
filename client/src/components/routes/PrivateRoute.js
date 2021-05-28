import * as React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import * as Routes from '../../routes';

const PrivateRoute = ({ path, authed, component }) =>
  authed ? (
    <Route path={path}>{component}</Route>
  ) : (
    <Redirect to={Routes.LOGIN_PAGE} />
  );

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  authed: PropTypes.bool.isRequired,
  component: PropTypes.object.isRequired,
};

export default PrivateRoute;
