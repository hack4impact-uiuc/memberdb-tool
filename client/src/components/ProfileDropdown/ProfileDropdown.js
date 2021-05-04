import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/ProfileDropdown.css';
import { Redirect } from 'react-router-dom';

import * as Routes from '../../routes';
import { endUserSession } from '../../utils/apiWrapper';

/**
 * Displays the Profile icon in the navbar + dropdown components for logout and viewing profile
 * @param {Object} user the current user of the session
 */
const ProfileDropdown = ({ user }) => {
  const [redirectToMemberPage, setRedirectToMemberPage] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // resets redirectToMemberPage to false after leaving page
  useEffect(() => {
    setRedirectToMemberPage(false);
  }, [redirectToMemberPage]);

  const handleProfileRedirect = () => {
    setRedirectToMemberPage(true);
  };

  const logout = () => {
    const endSession = async () => {
      const resp = await endUserSession();
      if (!resp.error) setIsLoggedOut(true);
    };
    endSession();
  };

  return (
    <div className="dropdown">
      {/** JSX Redirects */}
      {redirectToMemberPage && (
        <Redirect to={Routes.MEMBER_PAGE.replace(':memberID', user._id)} />
      )}
      {isLoggedOut && <Redirect to={Routes.LOGIN_PAGE} />}

      {/** Rendered JSX */}
      <p>
        Hello, {user.firstName}!
        {/* <img alt="Blank Profile" src={blankProfilePicture} className="avatar" /> */}
        <div className="avatar">{user.firstName?.[0] ?? '!'}</div>
      </p>
      <div className="dropdown-content">
        <button
          onClick={handleProfileRedirect}
          type="button"
          className="dropdown-item"
        >
          View Profile
        </button>
        <button type="button" className="dropdown-item" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

ProfileDropdown.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string,
  }).isRequired,
};

export default ProfileDropdown;
