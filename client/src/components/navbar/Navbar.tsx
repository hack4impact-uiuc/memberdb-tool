// @flow
import React, { ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';

import '../../css/Navbar.css';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import { levelEnum } from '../../utils/consts';
import * as Routes from '../../routes';
import bannerLogo from '../../assets/banner-full-color.svg';

type NavItemProp = {
  route: string,
  label: string,
}
const NavItem = ({ route, label}: NavItemProp) => (
  <li><NavLink to={route}>{label}</NavLink></li>
)

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
const Navbar = ({ user }: NavbarProp): ReactElement => {
  const { DEFAULT, CHAPTERS, PROJECTS, SUMMARY, NOTES } = Routes;
  return (
    <div className="nav-wrapper">
      <nav>
        <h2 id="nav-title">
          <Link className="nav-link" to={Routes.DEFAULT}>
            <div className="nav-brand">
              <img src={bannerLogo} alt="Hack4Impact banner" />
              <div className="nav-title">Member Database</div>
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
            <NavLink to={Routes.DEFAULT} exact>
              Members
            </NavLink>
          </li>
          <NavItem route={CHAPTERS} label={'Chapters'}/>
          <NavItem route={PROJECTS} label={'Projects'}/>
          <NavItem route={SUMMARY} label={'Summary'}/>
          <NavItem route={NOTES} label={'Notes'}/>
          <li>
            <ProfileDropdown user={user} />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
