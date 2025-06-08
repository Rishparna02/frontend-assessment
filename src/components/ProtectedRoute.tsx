import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "@/lib/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getToken();
  // Optionally, add JWT validation logic here
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
