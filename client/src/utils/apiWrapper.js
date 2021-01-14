import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_VERCEL_URL
  ? `https://${process.env.REACT_APP_VERCEL_URL}/api`
  : 'http://localhost:9000/api';

/**
 * Returns a sample API response to demonstrate a working backend
 * Returns GET_SAMPLE_FAIL upon failure
 */
export const getSampleResponse = () => {
  const requestString = `${BASE_URL}/home`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch(error => ({
      type: 'GET_SAMPLE_FAIL',
      error,
    }));
};

export const getUserAuth = () => {
  const requestString = `${BASE_URL}/auth/user`;
  console.log(requestString);
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

export const startUserSession = () => {
  const requestString = `${BASE_URL}/auth/login`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch(error => ({
      type: 'GET_SESSION_START_FAIL',
      error,
    }));
};

export const endUserSession = () => {
  const requestString = `${BASE_URL}/auth/logout`;
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch(error => ({
      type: 'GET_SESSION_END_FAIL',
      error,
    }));
};

/**
 * Executes a sample POST request
 * Returns POST_SAMPLE_FAIL upon failure
 */
export const addSampleResponse = body => {
  const requestString = `${BASE_URL}/home`;
  return axios
    .post(requestString, body, {
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .catch(error => ({
      type: 'POST_SAMPLE_FAIL',
      error,
    }));
};
