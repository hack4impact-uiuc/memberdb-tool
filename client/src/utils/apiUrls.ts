/* eslint-disable no-nested-ternary */
const BACKEND_BASE_URL =
  process.env.REACT_APP_VERCEL_ENV === 'production'
    ? `https://members.h4i.app/api`
    : process.env.REACT_APP_VERCEL_ENV === 'preview'
    ? `https://${process.env.REACT_APP_VERCEL_URL}/api`
    : 'http://localhost:9000/api';

const FRONTEND_BASE_URL =
  process.env.REACT_APP_VERCEL_ENV === 'production'
    ? `https://members.h4i.app`
    : process.env.REACT_APP_VERCEL_ENV === 'preview'
    ? `https://${process.env.REACT_APP_VERCEL_URL}`
    : 'http://localhost:3000';

export { BACKEND_BASE_URL, FRONTEND_BASE_URL };
