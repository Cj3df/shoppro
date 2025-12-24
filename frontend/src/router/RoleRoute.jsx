import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        // Redirect to home or unauthorized page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;
