// @flow
import React from 'react';
import type { Node } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Header, Icon, Image, Message } from 'semantic-ui-react';

import googleIcon from '../assets/google-logo.png';
import '../css/Login.css';
import { FRONTEND_BASE_URL } from '../utils/apiUrls';
import buildURI from '../utils/apiHelpers';

const LOGIN_FAILURE_QUERY_PARAM = 'failure';
const LOGIN_FAILURE_TEXT =
  "First time logging in? Your email isn't verified. Please contact an admin.";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * Displays the login page over everything else
 */
const Login = (): Node => {
  const didLoginFail = useQuery().get(LOGIN_FAILURE_QUERY_PARAM);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Member Database Login</h2>
        {didLoginFail !== null && didLoginFail !== undefined && (
          <Message color="red">
            <Header as="h4">
              <Icon name="warning circle" />
              <Header.Content>Login Failed!</Header.Content>
            </Header>
            <Message.Content>{LOGIN_FAILURE_TEXT}</Message.Content>
          </Message>
        )}
        <Button className="login-btn" color="orange">
          <a
            href={buildURI(
              'auth/login',
              FRONTEND_BASE_URL,
              `${FRONTEND_BASE_URL}/login?${LOGIN_FAILURE_QUERY_PARAM}=1`,
            )}
          >
            <Header as="h5">
              <Image circular src={googleIcon} /> Sign in with Google
            </Header>
            {/* <img className="google-icon" src={googleIcon} alt="Google Icon" />
          Sign in with Google */}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Login;
