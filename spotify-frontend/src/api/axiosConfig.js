// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://spotify-backend-77s2.onrender.com/api', // Your Express backend URL
    withCredentials: true // Sends the JWT cookie with every request
});

export default api;
