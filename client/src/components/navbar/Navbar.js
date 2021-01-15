import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../css/Navbar.css';

import Profile from '../Profile/Profile';
import * as Routes from '../../routes';

/**
 * Navbar display to view user sesion and React-route-dom navigation
 * @param {Object} user the current user of the session
 */
const Navbar = ({ user }) => (
  <nav className="nav">
    <h2 id="nav-title">
      <Link className="nav-link" to={Routes.DEFAULT}>
        H4I Member Database
      </Link>
    </h2>
    <div className="profile-item">
      <h2 id="welcome-text">
        Hello, {user.firstName}!
      </h2>
      <Profile />
    </div>
  </nav>
);

Navbar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    oauthID: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    __v: PropTypes.number.isRequired,
  }).isRequired,
};

export default Navbar;
