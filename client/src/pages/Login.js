import React from 'react';
import PropTypes from 'prop-types';
import googleIcon from '../assets/google-logo.png';

import '../css/Login.css';

import { BASE_URL } from '../utils/apiWrapper';

/**
 * Displays the login page over everything else
 * @param {func} login connects to backend to start a users current session.
 */
const Login = ({ login }) => {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Member Database Login</h2>
        <button type="button" onClick={login} className="login-btn">
          <img className="google-icon" src={googleIcon} alt="Google Icon" />
          Sign in with Google
        </button>
        <a type="button" href={`${BASE_URL}/auth/login?successRedirect=http://localhost:3000`} className="login-btn">
          <img className="google-icon" src={googleIcon} alt="Google Icon" />
          Sign in with Google
        </a>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default Login;
