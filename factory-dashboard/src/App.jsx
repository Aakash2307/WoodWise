import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import FactoryOnboarding from "./pages/FactoryOnboarding";
import LandingPage from "./pages/LandingPage"
import ForgotPass from "./pages/ForgotPassword/ForgotPass";

import { ROLES, getRoleHomePage, getUser } from "./api";

// Role-specific pages
import FactoryAdmin from "./pages/Roles/FactoryAdmin/FactoryAdmin";
import SystemAdmin from "./pages/Roles/SystemAdmin/SystemAdmin";
import Accountant from "./pages/Roles/Accountant/Accountant";
import Clerk from "./pages/Roles/Clerk/Clerk";
import Manager from "./pages/Roles/Manager/Manager";

// Wrapper so useNavigate works inside the onboarding route
function OnboardingRoute() {
  const navigate = useNavigate();
  return (
    <FactoryOnboarding
      onComplete={() => {
        const user = getUser();
        navigate(getRoleHomePage(user?.role), { replace: true });
      }}
    />
  );
}

function LandingRoute() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onLogin={() => navigate("/login")}
      onSignup={() => navigate("/signup")}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        
        

        {/* Onboarding — requires a token but no Layout/sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingRoute />} />
        </Route>

        {/* Protected routes — wrapped in Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            {/* System Admin */}
            <Route
              path="/system-admin"
              element={<ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} />}
            >
              <Route index element={<SystemAdmin />} />
            </Route>

            {/* Factory Admin */}
            <Route
              path="/factory-admin"
              element={<ProtectedRoute allowedRoles={[ROLES.FACTORY_ADMIN]} />}
            >
              <Route index element={<FactoryAdmin />} />
            </Route>

            {/* Manager */}
            <Route
              path="/manager"
              element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}
            >
              <Route index element={<Manager />} />
            </Route>

            {/* Accountant */}
            <Route
              path="/accountant"
              element={<ProtectedRoute allowedRoles={[ROLES.ACCOUNTANT]} />}
            >
              <Route index element={<Accountant />} />
            </Route>

            {/* Clerk */}
            <Route
              path="/clerk"
              element={<ProtectedRoute allowedRoles={[ROLES.CLERK]} />}
            >
              <Route index element={<Clerk />} />
            </Route>

          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}