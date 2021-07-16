// @flow
import React from 'react';
import type { Node } from 'react';
import { Link, NavLink } from 'react-router-dom';

import '../../css/Navbar.css';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import { levelEnum } from '../../utils/consts';
import * as Routes from '../../routes';
import bannerLogo from '../../assets/banner-full-color.svg';

type NavbarProp = {
  user: {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    level: string,
  },
};

/**
 * Navbar display to view user sesion and React-route-dom navigation
 * @param {Object} user the current user of the session
 */
const Navbar = ({ user }: NavbarProp): Node => (
  <nav>
    <h2 id="nav-title">
      <Link className="nav-link" to={Routes.DEFAULT}>
        <div className="nav-brand">
          <img src={bannerLogo}></img>
          Member Database
        </div>
      </Link>
    </h2>
    <ul>
      {levelEnum[user.level] >= levelEnum.DIRECTOR && (
        <li>
          <NavLink to="/member/new">Add Member</NavLink>
        </li>
      )}
      <li>
        <NavLink to="/">Members</NavLink>
      </li>
      <li>
        <NavLink to="/notes">Chapters</NavLink>
      </li>
      <li>
        <NavLink to="/">Projects</NavLink>
      </li>
      <li>
        <NavLink to="/notes">Summary</NavLink>
      </li>
      <li className="profile-item">
        <ProfileDropdown user={user} />
      </li>
    </ul>
  </nav>
);

export default Navbar;
