import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './Routes/AppRouter';
import { setUser, logout } from './modules/auth/AuthSlice';
import { getMe } from './modules/auth/AuthApi';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (token && !user) {
      getMe()
        .then(res => {
          if (res.data?.data?.user) {
            dispatch(setUser(res.data.data.user));
          }
        })
        .catch(err => {
          if (err.response?.status === 401) {
            console.warn("Session expired or invalid token. Clearing auth state.");
          } else {
            console.error("Error restoring session:", err);
          }
          dispatch(logout());
        });
    }
  }, [token, user, dispatch]);

  return <AppRouter />;
}

export default App;