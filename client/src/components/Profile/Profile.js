import React from 'react';
import '../../css/Profile.css';
import blankProfilePicture from '../../assets/blank-profile-picture.png';
import * as Routes from '../../routes';
import { Link } from 'react-router-dom';

const Profile = ({ logout }) => {
  return (
    <div className="dropdown">
      <img alt="Blank Profile" src={blankProfilePicture} className="avatar" />
      <div className="dropdown-content">
        <a>
          <Link style={{ margin: 0, padding: 0 }} to={Routes.MEMBER_PAGE_ROUTE}>
            View Profile
          </Link>
        </a>
        <a onClick={logout}>Logout</a>
      </div>
    </div>
  );
};

export default Profile;
