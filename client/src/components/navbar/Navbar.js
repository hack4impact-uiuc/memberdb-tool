import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../css/Navbar.css';

import Profile from '../Profile/Profile';

import * as Routes from '../../routes';

/**
 * Navbar display to view user sesion and React-route-dom navigation
 * @param {func} logout connects to backend to end a users current session and log them out.
 */
const Navbar = ({ logout }) => {
  return (
    <nav className="nav">
      <h2 id="nav-title">
        <Link className="nav-link" to={Routes.DEFAULT_ROUTE}>
          Member Database
        </Link>
      </h2>
      <div className="profile-item">
        <h2 id="welcome-text">Hello, User!</h2>
        <Profile logout={logout} />
      </div>
    </nav>
  );
};

Navbar.propType = {
  logout: PropTypes.func.isRequired,
};

export default Navbar;
