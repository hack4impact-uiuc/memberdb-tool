import React from 'react';

import '../../css/Profile.css';

import blankProfilePicture from '../../assets/blank-profile-picture.png';

const Profile = () => {

    return (
        <div className="dropdown">
            <img src={blankProfilePicture} className="avatar" />
            <div className="dropdown-content">
                <a href="#">View Profile</a>
                <a href="#">Logout</a>
            </div>
        </div>
    )
}

export default Profile;