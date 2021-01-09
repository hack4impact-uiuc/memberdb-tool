import React from 'react';
import googleIcon from '../assets/google-logo.png';

import '../css/Login.css';

const Login = ({ login }) => {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Member Database Login</h1>
        <a onClick={login} className="login-btn">
          <img className="google-icon" src={googleIcon} alt="Google Icon" />
          Sign in with Google
        </a>
      </div>
    </div>
  );
};

export default Login;
