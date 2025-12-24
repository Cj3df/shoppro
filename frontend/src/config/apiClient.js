import axios from 'axios';

// Create axios instance
// In production, we use the absolute URL from environment variables.
// In development, we fallback to '/api' which is proxied by Vite.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies if needed, though we use Bearer token
});

// Request interceptor: Attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and not a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Clear token and redirect to login if session expired
            // But don't redirect if it's already the login page to avoid loops

            // Optionally emit an event to clear auth state
            if (window.location.pathname !== '/login') {
                // We'll handle logout via AuthContext, but here we can just reject
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
