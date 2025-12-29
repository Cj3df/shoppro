import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../config/apiClient';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component - wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
    // State for user data
    const [user, setUser] = useState(null);
    
    // State for authentication token (get from localStorage if exists)
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    
    // State to track if user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // State to show loading while checking auth
    const [loading, setLoading] = useState(true);

    // ============ LOGIN FUNCTION ============
    // This function logs in a user with email and password
    const login = async (email, password) => {
        try {
            // Send login request to backend
            const { data } = await apiClient.post('/auth/login', { email, password });
            
            if (data.success) {
                // Save token to localStorage
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data.data.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            // Handle error
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            return { success: false, message };
        }
    };

    // ============ REGISTER FUNCTION ============
    // This function creates a new user account
    const register = async (name, email, password) => {
        try {
            // Send register request to backend
            const { data } = await apiClient.post('/auth/register', { name, email, password });
            
            if (data.success) {
                // Save token to localStorage
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data.data.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            // Handle error
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            return { success: false, message };
        }
    };

    // ============ LOGOUT FUNCTION ============
    // This function logs out the user
    const logout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Clear all auth state
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // ============ CHECK AUTH ON PAGE LOAD ============
    // This runs when the app loads to check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            // If we have a token, verify it's still valid
            if (token) {
                try {
                    // Get current user info from backend
                    const { data } = await apiClient.get('/auth/me');
                    
                    if (data.success) {
                        setUser(data.data.user);
                        setIsAuthenticated(true);
                    } else {
                        // Token is invalid, logout
                        logout();
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            // Done loading
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    // ============ UPDATE PROFILE FUNCTION ============
    // This function updates the user's profile
    const updateProfile = async (profileData) => {
        try {
            const { data } = await apiClient.put('/auth/profile', profileData);
            
            if (data.success) {
                // Update local user state with new data
                setUser((prev) => ({ ...prev, ...data.data.user }));
                return { success: true, message: data.message };
            }
            return { success: false, message: 'Update failed' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    // ============ TOGGLE WISHLIST FUNCTION ============
    // This function adds or removes a product from wishlist
    const toggleWishlist = async (productId) => {
        // Must be logged in to use wishlist
        if (!isAuthenticated) return false;
        
        try {
            const { data } = await apiClient.post(`/wishlist/${productId}`);
            
            // Refresh user to get updated wishlist
            const me = await apiClient.get('/auth/me');
            if (me.data.success) {
                setUser(me.data.data.user);
            }
            
            return data.isWishlisted;
        } catch (error) {
            console.error('Wishlist toggle failed:', error);
            return null;
        }
    };

    // ============ PROVIDE CONTEXT VALUES ============
    // These values are available to all components that use this context
    const contextValue = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
