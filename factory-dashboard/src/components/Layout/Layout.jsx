import React, { useState } from "react";
import styles from "./Layout.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

export default function Layout({ children, activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={styles.body}>
        <Header
          activePage={activePage}
          onToggle={() => setCollapsed(c => !c)}
        />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
