import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Materials from "./pages/Materials/Materials";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no sidebar/layout */}
        <Route path="/"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App pages — wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard"          element={<Dashboard />} />
          <Route path="/materials" element={<Materials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}