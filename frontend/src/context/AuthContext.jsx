import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../config/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    // Verify token and get user details
                    const { data } = await apiClient.get('/auth/me');
                    if (data.success) {
                        setUser(data.data.user);
                        setIsAuthenticated(true);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    // Login function
    const login = async (email, password) => {
        try {
            const { data } = await apiClient.post('/auth/login', { email, password });

            if (data.success) {
                const { token, user } = data.data;
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    // Register function
    const register = async (name, email, password) => {
        try {
            const { data } = await apiClient.post('/auth/signup', { name, email, password });

            if (data.success) {
                const { token, user } = data.data;
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update profile
    const updateProfile = async (profileData) => {
        try {
            const { data } = await apiClient.put('/auth/profile', profileData);
            if (data.success) {
                setUser((prev) => ({ ...prev, ...data.data.user }));
                return { success: true, message: data.message };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    // Toggle Wishlist
    const toggleWishlist = async (productId) => {
        if (!isAuthenticated) return false;
        try {
            const { data } = await apiClient.post(`/wishlist/${productId}`);
            // Refresh user details to get updated wishlist
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

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                login,
                register,
                logout,
                updateProfile,
                toggleWishlist,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
