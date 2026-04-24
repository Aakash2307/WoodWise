import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser, getMe, ROLES , getRoleHomePage } from "../api";

/**
 * ProtectedRoute wrapper
 * - Checks if user is logged in
 * - Fetches current user from /auth/me if not in localStorage
 * - Redirects based on role
 */
export default function ProtectedRoute({ allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      // Not logged in → redirect to login
      if (!token) {
        setLoading(false);
        return;
      }

      // Try to get user from localStorage first
      let currentUser = getUser();

      // If not in localStorage, fetch from API
      if (!currentUser) {
        try {
          currentUser = await getMe();
        } catch (err) {
          // Token invalid or expired → getMe will trigger 401 interceptor
          setLoading(false);
          return;
        }
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but trying to access wrong role's page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHomePage(user.role)} replace />;
  }

  // All good → render children
  return <Outlet />;
}

/**
 * Role-based home page routing
 */
