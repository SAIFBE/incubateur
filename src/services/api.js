import axios from 'axios';

const AUTH_USER_KEY = 'cmc_incubator_user';
const AUTH_TOKEN_KEY = 'cmc_incubator_token';

const getAuthToken = () => sessionStorage.getItem(AUTH_TOKEN_KEY);

const clearAuthSession = () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Request interceptor to attach the Bearer token for the current browser session.
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle unauthorized errors globally.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const requestAuthorization = error.config?.headers?.Authorization;
            const requestToken = typeof requestAuthorization === 'string'
                ? requestAuthorization.replace(/^Bearer\s+/i, '')
                : null;
            const currentToken = getAuthToken();
            const isLoginRequest = error.config?.url === '/login';

            // Ignore a late 401 from an older session: it must never erase a
            // token that was issued by a more recent successful login.
            if (isLoginRequest || !requestToken || requestToken !== currentToken) {
                return Promise.reject(error);
            }

            clearAuthSession();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default api;
