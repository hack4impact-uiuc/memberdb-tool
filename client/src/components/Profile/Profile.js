import React from 'react';
import PropTypes from 'prop-types';
import '../../css/Profile.css';
import blankProfilePicture from '../../assets/blank-profile-picture.png';
import * as Routes from '../../routes';
import { Link, Redirect } from 'react-router-dom';

const Profile = ({ logout }) => {
  const [redirectToMemberPage, setRedirectToMemberPage] = React.useState(false);

  const handleProfileRedirect = () => {
    setRedirectToMemberPage(true);
  };

  return (
    <div className="dropdown">
      {redirectToMemberPage ? (
        <Redirect to={Routes.MEMBER_PAGE_ROUTE} />
      ) : (
        <></>
      )}
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

Profile.propType = {
  logout: PropTypes.func.isRequired,
};

export default Profile;
