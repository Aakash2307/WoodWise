import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout"; // Global default layout
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import FactoryOnboarding from "./pages/FactoryOnboarding";
import LandingPage from "./pages/LandingPage";
import ForgotPass from "./pages/ForgotPassword/ForgotPass";

import { ROLES, getRoleHomePage, getUser } from "./api";

// Role-specific pages
import SystemAdmin from "./pages/Roles/SystemAdmin/SystemAdmin";
import Accountant from "./pages/Roles/Accountant/Accountant";
import Clerk from "./pages/Roles/Clerk/Clerk";
import Manager from "./pages/Roles/Manager/Manager";
import FactoryAdminDashboard from "./pages/Roles/FactoryAdmin/FactoryAdminDashboard";

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
        {/* ── Public Routes ──────────────────────────────────────── */}
        <Route path="/" element={<LandingRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPass />} />

        {/* ── Onboarding Route ──────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingRoute />} />
        </Route>

        {/* ── Protected Routes (Layouts handled individually) ────── */}
        <Route element={<ProtectedRoute />}>

          {/* System Admin */}
          <Route
            path="/system-admin"
            element={<ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} />}
          >
            {/* If System Admin needs a layout, wrap it here. Otherwise, leave it clean */}
            <Route element={<Layout />}>
              <Route index element={<SystemAdmin />} />
            </Route>
          </Route>

          {/* Factory Admin — Customize layout independently */}
          <Route
            path="/factory-admin"
            element={<ProtectedRoute allowedRoles={[ROLES.FACTORY_ADMIN]} />}
          >
            {/* 💡 CHANGE HERE: If Factory Admin doesn't use the standard Layout, 
                remove <Route element={<Layout />}> and just render the component */}
            
              <Route index element={<FactoryAdminDashboard />} />
            
          </Route>

          {/* Manager */}
          <Route
            path="/manager"
            element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}
          >
            <Route element={<Layout />}>
              <Route index element={<Manager />} />
            </Route>
          </Route>

          {/* Accountant */}
          <Route
            path="/accountant"
            element={<ProtectedRoute allowedRoles={[ROLES.ACCOUNTANT]} />}
          >
            <Route element={<Layout />}>
              <Route index element={<Accountant />} />
            </Route>
          </Route>

          {/* Clerk */}
          <Route
            path="/clerk"
            element={<ProtectedRoute allowedRoles={[ROLES.CLERK]} />}
          >
            <Route element={<Layout />}>
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