import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/Profile.css';
import blankProfilePicture from '../../assets/blank-profile-picture.png';
import * as Routes from '../../routes';
import { Redirect } from 'react-router-dom';

/**
 * Displays the Profile icon in the navbar + dropdown components for logout and viewing profile
 * @param {func} logout connects to backend to end a users current session and log them out.
 */
const Profile = ({ logout }) => {
  const [redirectToMemberPage, setRedirectToMemberPage] = useState(false);

  useEffect(() => {
    setRedirectToMemberPage(false);
  }, [redirectToMemberPage]);

  const handleProfileRedirect = () => {
    setRedirectToMemberPage(true);
  };

  return (
    <div className="dropdown">
      {redirectToMemberPage && <Redirect to={Routes.MEMBER_PAGE_ROUTE} />}
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

Profile.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Profile;
