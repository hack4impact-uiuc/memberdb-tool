import React from 'react';
import PropTypes from 'prop-types';
import googleIcon from '../assets/google-logo.png';

import '../css/Login.css';

const Login = ({ login }) => {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Member Database Login</h1>
        <button onClick={login} className="login-btn">
          <img className="google-icon" src={googleIcon} alt="Google Icon" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

Login.propType = {
  login: PropTypes.func.isRequired,
};

export default Login;
