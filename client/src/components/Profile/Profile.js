import React, { useState, useEffect } from 'react';
import '../../css/Profile.css';
import { Redirect } from 'react-router-dom';

import blankProfilePicture from '../../assets/blank-profile-picture.png';
import * as Routes from '../../routes';
import { endUserSession } from '../../utils/apiWrapper';

/**
 * Displays the Profile icon in the navbar + dropdown components for logout and viewing profile
 */
const Profile = () => {
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
      {/* TODO: Fetch the real member ID of the current user */}
      {redirectToMemberPage && (
        <Redirect
          to={Routes.MEMBER_PAGE.replace(
            ':memberID',
            '5ffcc6ed3410cba712b969af',
          )}
        />
      )}
      {isLoggedOut && <Redirect to={Routes.LOGIN_PAGE} />}

      {/** Rendered JSX */}
      <img alt="Blank Profile" src={blankProfilePicture} className="avatar" />
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

export default Profile;
