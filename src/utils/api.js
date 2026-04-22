import axios from 'axios';

// Ek custom axios instance bana rahe hain
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Dhyan rakhna backend 5000 par hi chal raha ho
});

// REQUEST INTERCEPTOR: Backend ko call karne se pehle ye check karega
api.interceptors.request.use(
  (config) => {
    // LocalStorage se token uthao
    const token = localStorage.getItem('token');
    
    // Agar token hai, toh use headers mein chipka do (Bearer token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;