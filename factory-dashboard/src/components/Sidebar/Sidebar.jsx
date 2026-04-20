import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const SofaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="9" width="16" height="5" rx="1.5"/>
    <rect x="3" y="6" width="12" height="3" rx="1"/>
    <line x1="4" y1="14" x2="4" y2="17"/>
    <line x1="14" y1="14" x2="14" y2="17"/>
  </svg>
);

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="1" width="7" height="7" rx="1.5"/>
    <rect x="10" y="1" width="7" height="7" rx="1.5"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5"/>
  </svg>
);

const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z"/>
    <path d="M9 1V17M2 5L9 9L16 5"/>
  </svg>
);

const WarehouseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 7H15V17H3Z"/>
    <path d="M1 7L9 1L17 7"/>
    <line x1="7" y1="17" x2="7" y2="12"/>
    <line x1="11" y1="17" x2="11" y2="12"/>
    <line x1="7" y1="12" x2="11" y2="12"/>
  </svg>
);

const MaterialsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z"/>
    <path d="M9 1V17M2 5L9 9L16 5"/>
  </svg>
);

const TransferIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M2 6H13M13 6L10 3M13 6L10 9"/>
    <path d="M16 12H5M5 12L8 9M5 12L8 15"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2" y="3" width="14" height="13" rx="1.5"/>
    <path d="M6 3V1M12 3V1M2 7H16"/>
    <line x1="9" y1="10" x2="9" y2="14"/>
    <line x1="7" y1="12" x2="11" y2="12"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="9" r="7.5"/>
    <path d="M9 4.5V9L12 11.5"/>
  </svg>
);

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard",    path: "/",          Icon: GridIcon },
      { label: "Products",     path: "/products",  Icon: BoxIcon },
      { label: "Locations",    path: "/locations", Icon: WarehouseIcon },
      { label: "Materials",    path: "/materials", Icon: MaterialsIcon },
    ],
  },
  {
    label: "Actions",
    items: [
      { label: "Move Stock",   path: "/move-stock",   Icon: TransferIcon, badge: "3" },
      { label: "New Purchase", path: "/new-purchase", Icon: PlusIcon },
      { label: "History",      path: "/history",      Icon: ClockIcon },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <SofaIcon />
        </div>
        <div className={styles.logoWords}>
          <div className={styles.logoName}>WoodWise</div>
          <div className={styles.logoHint}>Inventory</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navGroups.map(group => (
          <div key={group.label}>
            <div className={styles.sectionLabel}>{group.label}</div>
            {group.items.map(({ label, path, Icon, badge }) => (
              <button
                key={path}
                className={`${styles.navItem} ${pathname === path ? styles.active : ""}`}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
              >
                <span className={styles.navIcon}><Icon /></span>
                <span className={styles.navLabel}>{label}</span>
                {badge && <span className={styles.navBadge}>{badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.foot}>
        <div className={styles.onlinePill}>
          <span className={styles.onlineDot} />
          <span className={styles.onlineText}>System online</span>
        </div>
      </div>
    </aside>
  );
}