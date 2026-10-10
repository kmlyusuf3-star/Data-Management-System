import axios from 'axios';

// Ini adalah alamat Backend kita
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;