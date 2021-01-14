import axios from 'axios';

import { BACKEND_BASE_URL } from './apiUrls';

// Axios Configuration
axios.defaults.withCredentials = true;

// retrieves the session status of the current user
export const getUserAuth = () => {
  const requestString = `${BACKEND_BASE_URL}/members/current`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch(error => ({
      type: 'GET_AUTH_FAIL',
      error,
    }));
};

// logs a user out
export const endUserSession = () => {
  const requestString = `${BACKEND_BASE_URL}/auth/logout`;
  return axios
    .post(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch(error => ({
      type: 'GET_SESSION_END_FAIL',
      error,
    }));
};

// Retrieves a member from their mongo ID
export const getMemberByID = (mongoID) => {
  const requestString = `${BACKEND_BASE_URL}/members/${mongoID}`
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch(error => ({
      type: 'GET_MEMBER_BY_ID_FAIL',
      error,
    }));
}
