import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";

const pageSubtitles = {
  "Dashboard":    "Home",
  "Products":     "All products",
  "Locations":    "Warehouse & stores",
  "Move Stock":   "Transfer between locations",
  "New Purchase": "Add new stock",
  "History":      "Past records",
};

export default function Header({ activePage, onToggle }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setDate(d.toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
      }));
    };
    fmt();
    const t = setInterval(fmt, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className={styles.header}>
      <button className={styles.toggleBtn} onClick={onToggle} aria-label="Toggle menu">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6">
          <line x1="1" y1="3" x2="14" y2="3"/>
          <line x1="1" y1="7.5" x2="14" y2="7.5"/>
          <line x1="1" y1="12" x2="14" y2="12"/>
        </svg>
      </button>

      <div className={styles.titles}>
        <div className={styles.pageTitle}>{activePage}</div>
        <div className={styles.pageSub}>{pageSubtitles[activePage] || ""}</div>
      </div>

      <div className={styles.spacer} />

      <div className={styles.date}>{date}</div>

      <div className={styles.divider} />

      <button className={styles.userBtn}>
        <div className={styles.userAvatar}>RK</div>
        <span className={styles.userName}>Ramesh</span>
      </button>
    </header>
  );
}
