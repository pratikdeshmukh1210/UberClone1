import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../auth/AuthSlice';

const PrivateRoute = ({ allowedRoles = [] }) => {
    const dispatch = useDispatch();
    const { user, token, isRestoringSession } = useSelector((state) => state.auth);
    const location = useLocation();

    // STATE 1: SESSION_LOADING
    // Token exists in localStorage, session restoration via /api/auth/me is in-flight
    if (token && !user && isRestoringSession) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                <p className="text-xl font-bold tracking-tight">Restoring session...</p>
            </div>
        );
    }

    // STATE 2: UNAUTHENTICATED
    // No token exists, or auth failed (401/403 cleared token and finished loading)
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // EDGE CASE: Network Error / Server Down while restoring session
    // Token exists, restoration completed without auth error, but user is null due to network/server failure
    if (token && !user) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Unable to Connect to Server</h2>
                <p className="text-gray-400 mb-6 max-w-md">
                    We couldn't reach the server to restore your session. Please check your network connection.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => dispatch(logout())}
                        className="border border-gray-600 text-gray-300 px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    // STATE 3: AUTHENTICATED
    // Token and user exist. Enforce role-based route protection.
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        const fallbackPath = user?.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard';
        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
