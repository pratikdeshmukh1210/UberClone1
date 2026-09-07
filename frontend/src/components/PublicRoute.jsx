import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  let { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/api/home" />;
  }

  return <Outlet />;
};

export default PublicRoute;