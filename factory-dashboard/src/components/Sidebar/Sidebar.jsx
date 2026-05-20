import { useNavigate, useLocation } from "react-router-dom";
import s from "./Sidebar.module.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SofaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="9" width="16" height="5" rx="1.5" />
    <rect x="3" y="6" width="12" height="3" rx="1" />
    <line x1="4" y1="14" x2="4" y2="17" />
    <line x1="14" y1="14" x2="14" y2="17" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",  path: "/factory-admin" },
  { label: "Inventory",  path: "/factory-admin/inventory" },
  { label: "Materials",  path: "/factory-admin/materials" },
  { label: "Orders",     path: "/factory-admin/orders" },
  { label: "Locations",  path: "/factory-admin/locations" },
  { label: "Reports",    path: "/factory-admin/reports" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
/**
 * Shared sidebar for all Factory Admin pages.
 *
 * Props:
 *   user       – { full_name?, email? }  current user object
 *   onLogout   – () => void              called when the user clicks "Log out"
 *   activePath – string (optional)       override active path detection
 *                                        (defaults to current location.pathname)
 */
export default function Sidebar({ user, onLogout, activePath }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the explicit override, or fall back to the current URL path.
  // For nested routes (e.g. /factory-admin/inventory/123) we match by prefix
  // so the correct nav item stays highlighted.
  const currentPath = activePath ?? location.pathname;

  const isActive = (itemPath) => {
    // Exact match for dashboard root to avoid it matching everything
    if (itemPath === "/factory-admin") return currentPath === "/factory-admin";
    return currentPath.startsWith(itemPath);
  };

  return (
    <aside className={s.sidebar}>
      {/* Brand */}
      <div className={s.sidebarBrand}>
        <div className={s.brandMark}>
          <SofaIcon />
        </div>
        <span className={s.brandName}>WoodWise</span>
      </div>

      {/* Role badge */}
      <div className={s.sidebarMeta}>
        <div className={s.tenantBadge}>Factory Admin</div>
      </div>

      {/* Nav */}
      <nav className={s.sidebarNav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            className={`${s.navItem} ${isActive(item.path) ? s.navItemActive : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer – user info + logout */}
      <div className={s.sidebarFooter}>
        <div className={s.sidebarUser}>
          <div className={s.userAvatar}>
            {(user?.full_name || user?.email || "A")[0].toUpperCase()}
          </div>
          <div className={s.userInfo}>
            <span className={s.userName}>{user?.full_name || "Factory Admin"}</span>
            <span className={s.userEmail}>{user?.email || ""}</span>
          </div>
        </div>
        <button className={s.logoutBtn} onClick={onLogout}>
          <LogOutIcon /> Log out
        </button>
      </div>
    </aside>
  );
}