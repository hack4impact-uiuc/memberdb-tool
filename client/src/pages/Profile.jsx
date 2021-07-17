// @flow
import React from 'react';

import Page from '../components/layout/Page';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import '../css/Profile.css';

const Profile = () => (
  <div className="profile-page">
    <Page title="Profile">
      <ProfileCard />
    </Page>
  </div>
);

export default Profile;
