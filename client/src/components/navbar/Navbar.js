import React from 'react';
import { Link } from 'react-router-dom';

import '../../css/Navbar.css';

import Profile from '../Profile/Profile';

import * as Routes from '../../routes';

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

export default Navbar;
