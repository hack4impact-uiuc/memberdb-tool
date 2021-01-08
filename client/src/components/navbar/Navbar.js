import React from 'react';

import '../../css/Navbar.css';

import Profile from '../Profile/Profile';

const Navbar = () => {
  return (
    <nav className="nav">
      <h2 id="nav-title">Member Database</h2>
      <div className="profile-item">
        <h2 id="welcome-text">Hello, User!</h2> 
        <Profile />
      </div>
    </nav>
  );

};

export default Navbar;
