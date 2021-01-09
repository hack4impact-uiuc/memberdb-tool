import React from 'react';
import PropTypes from 'prop-types';
import '../../css/Profile.css';
import blankProfilePicture from '../../assets/blank-profile-picture.png';
import * as Routes from '../../routes';
import { Link } from 'react-router-dom';

const Profile = ({ logout }) => {
  return (
    <div className="dropdown">
      <img alt="Blank Profile" src={blankProfilePicture} className="avatar" />
      <div className="dropdown-content">
        <Link
          className="dropdown-item dropdown-link"
          to={Routes.MEMBER_PAGE_ROUTE}
        >
          View Profile
        </Link>
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
