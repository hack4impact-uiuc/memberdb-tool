import React from 'react';

import googleIcon from '../assets/google-logo.png';
import '../css/Login.css';
import { FRONTEND_BASE_URL } from '../utils/apiUrls';
import buildURI from '../utils/apiHelpers';

/**
 * Displays the login page over everything else
 */
const Login = () => (
  <div className="login-wrapper">
    <div className="login-card">
      <h2>Member Database Login</h2>
      <a
        type="button"
        href={buildURI('auth/login', FRONTEND_BASE_URL)}
        className="login-btn"
      >
        <img className="google-icon" src={googleIcon} alt="Google Icon" />
        Sign in with Google
      </a>
    </div>
  </div>
);

export default Login;
