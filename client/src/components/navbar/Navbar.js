import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../css/Navbar.css';

import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
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
      <h2 id="welcome-text">Hello, {user.firstName}!</h2>
      <ProfileDropdown user={user} />
    </div>
  </nav>
);

Navbar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    email: PropTypes.string,
    level: PropTypes.string,
  }).isRequired,
};

export default Navbar;
