import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles = [] }) => {
    const { user, token } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If token is present but user profile hasn't loaded yet (restoring session on page refresh)
    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                <p className="text-xl font-bold tracking-tight">Restoring session...</p>
            </div>
        );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        const fallbackPath = user?.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard';
        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
