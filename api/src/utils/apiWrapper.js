const axios = require('axios');

const SERVICE_URL = 'https://h4i-encrypt.vercel.app';

const encryptNote = (body) => {
  const requestString = `${SERVICE_URL}/encrypt`;
  return axios.post(requestString, body).catch((error) => ({
    type: 'ENCRYPT_FAIL',
    error,
  }));
};

const decryptNote = (body) => {
  const requestString = `${SERVICE_URL}/decrypt`;
  return axios.post(requestString, body).catch((error) => ({
    type: 'DECRYPT_FAIL',
    error,
  }));
};

module.exports = {
  encryptNote,
  decryptNote,
};
