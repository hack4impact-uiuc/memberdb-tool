import React from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Icon } from '@hack4impact-uiuc/bridge';

import googleIcon from '../assets/google-logo.png';
import '../css/Login.css';
import { FRONTEND_BASE_URL } from '../utils/apiUrls';
import buildURI from '../utils/apiHelpers';

const LOGIN_FAILURE_TEXT =
  'First time logging in? Your email isn&apos;t verified. Please contact an admin.';

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * Displays the login page over everything else
 */
const Login = () => {
  const didLoginFail = useQuery().get('failure');

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Member Database Login</h2>
        {didLoginFail && (
          <Alert variant="error" mb="8px">
            <Icon type="errorAlert" />
            {LOGIN_FAILURE_TEXT}
          </Alert>
        )}
        <a
          type="button"
          href={buildURI(
            'auth/login',
            FRONTEND_BASE_URL,
            `${FRONTEND_BASE_URL}/login?failure=1`,
          )}
          className="login-btn"
        >
          <img className="google-icon" src={googleIcon} alt="Google Icon" />
          Sign in with Google
        </a>
      </div>
    </div>
  );
};

export default Login;
