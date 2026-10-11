import axios from 'axios';

const api = axios.create({
  baseURL: 'https://data-management-system-zeta.vercel.app'
});

export default api;