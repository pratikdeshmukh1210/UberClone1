import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './Routes/AppRouter';
import { setUser, logout, finishSessionRestoration } from './modules/auth/AuthSlice';
import { getMe } from './modules/auth/AuthApi';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const isRestoringSession = useSelector(state => state.auth.isRestoringSession);

  useEffect(() => {
    if (token && !user && isRestoringSession) {
      getMe()
        .then(res => {
          if (res.data?.data?.user) {
            dispatch(setUser(res.data.data.user));
          } else {
            dispatch(finishSessionRestoration());
          }
        })
        .catch(err => {
          const status = err.response?.status;
          if (status === 401 || status === 403) {
            // Authentication Failure: Token expired, invalid, or account deactivated/deleted
            console.warn(`Authentication failed (${status}). Clearing auth state.`);
            dispatch(logout());
          } else {
            // Network Failure or Server Error: Do NOT log out user, keep token in localStorage
            console.error("Network or server error while restoring session:", err);
            dispatch(finishSessionRestoration());
          }
        });
    }
  }, [token, user, isRestoringSession, dispatch]);

  return <AppRouter />;
}

export default App;