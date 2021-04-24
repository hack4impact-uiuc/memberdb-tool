import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import '../../css/Navbar.css';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import { levelEnum } from '../../utils/consts';
import * as Routes from '../../routes';

/**
 * Navbar display to view user sesion and React-route-dom navigation
 * @param {Object} user the current user of the session
 */
const Navbar = ({ user }) => {
  const [redirectToNewMemberPage, setRedirectToNewMemberPage] = useState(false);

  // resets redirectToNewMemberPage to false after leaving page
  useEffect(() => {
    setRedirectToNewMemberPage(false);
  }, [redirectToNewMemberPage]);

  const handleRedirectToNewMemberPage = () => {
    setRedirectToNewMemberPage(true);
  };

  return (
    <nav className="nav">
      {redirectToNewMemberPage && (
        <Redirect to={Routes.MEMBER_PAGE.replace(':memberID', 'new')} />
      )}
      <h2 id="nav-title">
        <Link className="nav-link" to={Routes.DEFAULT}>
          H4I Member Database
        </Link>
      </h2>
      {levelEnum[user.level] >= levelEnum.DIRECTOR && (
        <Button
          id="add-user"
          size="medium"
          onClick={handleRedirectToNewMemberPage}
        >
          Add User
        </Button>
      )}
      <div className="profile-item">
        <h2 id="welcome-text">Hello, {user.firstName}!</h2>
        <ProfileDropdown user={user} />
      </div>
    </nav>
  );
};

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
