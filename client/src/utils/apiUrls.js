const BACKEND_BASE_URL = process.env.REACT_APP_VERCEL_URL
  ? `https://${process.env.REACT_APP_VERCEL_URL}/api`
  : 'http://localhost:9000/api';

const FRONTEND_BASE_URL = process.env.REACT_APP_VERCEL_URL
  ? `https://${process.env.REACT_APP_VERCEL_URL}`
  : `http://localhost:3000`;

export { BACKEND_BASE_URL, FRONTEND_BASE_URL };
