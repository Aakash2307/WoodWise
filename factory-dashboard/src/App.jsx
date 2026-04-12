import React, { useState } from "react";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <Dashboard />
    </Layout>
  );
}
