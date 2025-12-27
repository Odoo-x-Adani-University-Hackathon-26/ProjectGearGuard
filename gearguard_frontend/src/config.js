// src/config.js
const API_URL = 'http://localhost:5000/api';

export const config = {
  API_URL,
  endpoints: {
    auth: {
      register: `${API_URL}/auth/register`,
      login: `${API_URL}/auth/login`,
      me: `${API_URL}/auth/me`,
      logout: `${API_URL}/auth/logout`,
    },
  },
};