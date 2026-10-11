import axios from 'axios';

// Ini adalah alamat Backend kita
const api = axios.create({
  baseURL: 'https://data-management-system-zeta.vercel.app/',
});

export default api;