import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Auth
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import GoogleCallbackPage from "../modules/auth/pages/GoogleCallbackPage";

// Main
import LandingPage from "../modules/common/pages/LandingPage";
import HelpPage from "../modules/common/pages/HelpPage";
import BusinessPage from "../modules/common/pages/BusinessPage";

// Driver
import DriverDashboardPage from "../modules/driver/pages/DriverDashboardPage";
import DriverRegisterPage from "../modules/driver/pages/DriverRegisterPage";

// Journey
import RiderDashboard from "../modules/journey/pages/RiderDashboard";
import ActiveRidePage from "../modules/journey/pages/ActiveRidePage";

// Middleware
import PrivateRoute from "../modules/common/middleware/PrivateRoute";

import ErrorPage from "../modules/common/pages/ErrorPage";

const AppRouter = () => {
  const router = createBrowserRouter([
    // Public Routes
    { path: "/", element: <LandingPage />, errorElement: <ErrorPage /> },
    { path: "/home", element: <LandingPage />, errorElement: <ErrorPage /> },

    // Public Auth & Pages
    { path: "/login", element: <LoginPage />, errorElement: <ErrorPage /> },
    { path: "/signup", element: <RegisterPage />, errorElement: <ErrorPage /> },
    { path: "/auth/callback", element: <GoogleCallbackPage />, errorElement: <ErrorPage /> },
    { path: "/help", element: <HelpPage />, errorElement: <ErrorPage /> },
    { path: "/business", element: <BusinessPage />, errorElement: <ErrorPage /> },

    // Protected Routes
    {
      element: <PrivateRoute />, 
      errorElement: <ErrorPage />,
      children: [
        // Rider Specific
        {
          element: <PrivateRoute allowedRoles={['RIDER']} />,
          children: [
            { path: "/rider/dashboard", element: <RiderDashboard /> }
          ]
        },
        
        // Driver Specific
        { path: "/driver/register", element: <DriverRegisterPage /> },
        { 
          element: <PrivateRoute allowedRoles={['DRIVER']} />, 
          children: [
            { path: "/driver/dashboard", element: <DriverDashboardPage /> }
          ] 
        },

        // Journey (Protected)
        { path: "/active-ride", element: <ActiveRidePage /> }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;