import { BACKEND_BASE_URL } from './apiUrls';

/**
 * Builds URL based on endpoint
 * @param {String} endpoint the endpoint for the URL
 * @param {String} successRedirect URL to redirect to on successful requests
 * @param {String} failureRedirect  URL to redirect to on failed requests
 */
const buildURI = (endpoint: string, successRedirect: string, failureRedirect = '/login') => {
  const uri = new URL(`${BACKEND_BASE_URL}/${endpoint}`);

  switch (endpoint) {
    case 'auth/login':
      uri.searchParams.append('successRedirect', successRedirect);
      uri.searchParams.append('failureRedirect', failureRedirect);
      break;
    default:
      break;
  }
  return uri;
};

export default buildURI;
