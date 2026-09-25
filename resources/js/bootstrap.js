import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Enterprise CSRF Interceptor: Attach X-CSRF-TOKEN header to all outgoing requests
window.axios.interceptors.request.use((config) => {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) {
        config.headers['X-CSRF-TOKEN'] = metaToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
