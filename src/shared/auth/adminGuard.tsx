import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from './authStorage';
import { isAdminUser } from './roleRedirect';

interface RouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute is accessible only by users whose role is Admin, Archivist, or Chief Editor.
 * If not authenticated, redirects to /login.
 * If authenticated but not an Admin, redirects to the home page (/).
 */
export const AdminRoute: React.FC<RouteProps> = ({ children }) => {
  const isAuthenticated = authStorage.isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdminUser()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
