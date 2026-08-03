import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from './authStorage';
import { getRedirectPathByRole } from './roleRedirect';

interface RouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute is accessible by anyone.
 * If an authenticated user attempts to access a public route (e.g. /login, /register),
 * they are automatically redirected based on their role:
 * - Admins (Admin, Archivist, Chief Editor) -> /admin/dashboard
 * - Normal Users -> /
 */
export const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const isAuthenticated = authStorage.isAuthenticated();

  if (isAuthenticated) {
    const dest = getRedirectPathByRole();
    return <Navigate to={dest} replace />;
  }

  return <>{children}</>;
};

/**
 * AuthenticatedRoute is accessible only by logged-in users.
 * If the user is not authenticated, they are redirected to /login.
 */
export const AuthenticatedRoute: React.FC<RouteProps> = ({ children }) => {
  const isAuthenticated = authStorage.isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
