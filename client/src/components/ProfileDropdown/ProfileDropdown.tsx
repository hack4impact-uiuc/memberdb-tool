// @flow
import React, { useState, useEffect, ReactElement } from 'react';
import '../../css/ProfileDropdown.css';
import { Redirect } from 'react-router-dom';

import * as Routes from '../../routes';
import { endUserSession } from '../../utils/apiWrapper';

type ProfileDropdownProp = {
  user: {
    _id: string,
    firstName: string,
  },
};

/**
 * Displays the Profile icon in the navbar + dropdown components for logout and viewing profile
 * @param {Object} user the current user of the session
 */
const ProfileDropdown = ({ user }: ProfileDropdownProp): ReactElement => {
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
      <div className="avatar">{user.firstName?.[0] ?? '?'}</div>
      <div className="dropdown-content">
        <button
          onClick={handleProfileRedirect}
          type="button"
          className="dropdown-item"
        >
          Profile
        </button>
        <button type="button" className="dropdown-item" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
