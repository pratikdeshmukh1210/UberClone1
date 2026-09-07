import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles = [] }) => {
    const { user, token } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        const fallbackPath = user?.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard';
        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
