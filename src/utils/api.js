import axios from 'axios';

// Ek common axios instance create karo
const api = axios.create({
  // 🚨 YAHAN APNA RENDER WALA LIVE URL DAALO
  baseURL: 'https://aura-backend-ynuo.onrender.com/api', 

  // 🚨 CORS KA MAGIC WAND: Ye line Frontend ko allow karegi cookies bhejna
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agar tumhare paas pehle se koi interceptors hain, toh unhe aise hi rehne do
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;