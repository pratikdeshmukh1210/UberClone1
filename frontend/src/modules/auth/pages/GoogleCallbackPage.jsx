import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../AuthSlice";
import { getMe } from "../AuthApi";

const GoogleCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get("token");
            if (token) {
                // 1. Save token into LocalStorage & Redux immediately
                dispatch(setToken(token));

                // Fetch user profile immediately
                getMe()
                    .then((res) => {
                        const user = res.data?.data?.user;
                        if (user) {
                            dispatch(setUser(user)); // also sets isRestoringSession = false
                            const target = user.role === 'DRIVER' ? '/driver/dashboard' : '/rider/dashboard';
                            navigate(target, { replace: true });
                        } else {
                            dispatch(finishSessionRestoration());
                            navigate("/home", { replace: true });
                        }
                    })
                    .catch((err) => {
                        const status = err.response?.status;
                        if (status === 401 || status === 403) {
                            dispatch(logout());
                            navigate("/login?error=google_auth_failed", { replace: true });
                        } else {
                            // Network error: preserve token, set isRestoringSession=false (or leave it to retry)
                            dispatch(finishSessionRestoration());
                            navigate("/home", { replace: true });
                        }
                    });
            } else {
                navigate("/login", { replace: true });
            }
        };

        handleCallback();
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-xl font-bold tracking-tight">Authenticating with Google...</p>
        </div>
    );
};

export default GoogleCallbackPage;
