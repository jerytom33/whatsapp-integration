import axios from 'axios';

// Backend URL - typically from env var, but hardcoded to localhost:3002 for now as per plan
const BASE_URL = 'http://localhost:3002/api/whatsapp';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const apiKey = localStorage.getItem('aoc_api_key');
    if (apiKey) {
        config.headers['x-aoc-api-key'] = apiKey;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
