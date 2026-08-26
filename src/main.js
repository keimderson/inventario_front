import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:8000/api';

// Este interceptor añade el token a CADA petición automáticamente
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const app = createApp(App);
app.use(router); // Le decimos a Vue que use el router
app.mount('#app');
