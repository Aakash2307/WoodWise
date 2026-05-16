import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, logout , getUser } from "../../../api";
import s from "./FactoryAdminDashboard.module.css";

// ─── icons ────────────────────────────────────────────────────────────────────
const SofaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="9" width="16" height="5" rx="1.5" />
    <rect x="3" y="6" width="12" height="3" rx="1" />
    <line x1="4" y1="14" x2="4" y2="17" />
    <line x1="14" y1="14" x2="14" y2="17" />
  </svg>
);

const BoxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const TagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",  path: "/factory-admin",            active: true  },
  { label: "Accounts",   path: "/factory-admin/accounts",   active: false },
  { label: "Orders",     path: "/factory-admin/orders",     active: false },
  { label: "Locations",  path: "/factory-admin/locations",  active: false },
  { label: "Reports",    path: "/factory-admin/reports",    active: false },
];

// ─── Quick-access inventory cards ─────────────────────────────────────────────
const INVENTORY_CARDS = [
  {
    title: "Product Inventory",
    desc: "Manage all products, SKUs, stock levels and reorder points across your locations.",
    icon: <BoxIcon />,
    color: "#8B6343",
    bg: "rgba(139,99,67,0.08)",
    border: "rgba(139,99,67,0.18)",
    path: "/factory-admin/inventory",
    tag: "Inventory",
  },
  {
    title: "Materials",
    desc: "Organise your materials and products into categories for faster filtering and reporting.",
    icon: <TagIcon />,
    color: "#1a5fa8",
    bg: "rgba(26,95,168,0.07)",
    border: "rgba(26,95,168,0.16)",
    path: "/factory-admin/materials",
    tag: "Inventory",
  },
  {
    title: "Locations",
    desc: "View and manage all your warehouses, stores and factory floors in one place.",
    icon: <MapPinIcon />,
    color: "#2d7a3a",
    bg: "rgba(45,122,58,0.07)",
    border: "rgba(45,122,58,0.16)",
    path: "/factory-admin/locations",
    tag: "Coming soon",
    disabled: true,
  },
  {
    title: "Stock Alerts",
    desc: "Track items running low and set thresholds to get notified before you run out.",
    icon: <AlertTriangleIcon />,
    color: "#b07d1a",
    bg: "rgba(176,125,26,0.07)",
    border: "rgba(176,125,26,0.16)",
    path: "/factory-admin/alerts",
    tag: "Coming soon",
    disabled: true,
  },
  {
    title: "Purchase Orders",
    desc: "Raise, track and receive purchase orders from your suppliers.",
    icon: <TrendingUpIcon />,
    color: "#7a3a8a",
    bg: "rgba(122,58,138,0.07)",
    border: "rgba(122,58,138,0.16)",
    path: "/factory-admin/orders",
    tag: "Coming soon",
    disabled: true,
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activePath, onNavigate, user, onLogout }) {
  return (
    <aside className={s.sidebar}>
      <div className={s.sidebarBrand}>
        <div className={s.brandMark}><SofaIcon /></div>
        <span className={s.brandName}>WoodWise</span>
      </div>

      <div className={s.sidebarMeta}>
        <div className={s.tenantBadge}>Factory Admin</div>
      </div>

      <nav className={s.sidebarNav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            className={`${s.navItem} ${activePath === item.path ? s.navItemActive : ""}`}
            onClick={() => onNavigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

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

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, bg, border, loading }) {
  return (
    <div className={s.statCard} style={{ borderColor: border }}>
      <div className={s.statIcon} style={{ background: bg, color }}>
        {icon}
      </div>
      <div className={s.statBody}>
        <div className={s.statLabel}>{label}</div>
        {loading
          ? <div className={s.statSkeleton} />
          : <div className={s.statValue}>{value}</div>
        }
      </div>
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function FactoryAdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser]             = useState(null);
  const [catCount, setCatCount]     = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);


  useEffect(() => {
  const currentUser = getUser();
  if (currentUser) setUser(currentUser);

  getCategories()
    .then(data => setCatCount(Array.isArray(data) ? data.length : data?.total ?? "—"))
    .catch(() => setCatCount("—"))
    .finally(() => setLoadingStats(false));
}, []);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const STATS = [
    { label: "Categories",      value: catCount ?? "—", icon: <TagIcon />,           color: "#8B6343", bg: "rgba(139,99,67,0.08)",   border: "rgba(139,99,67,0.15)"   },
    { label: "Total products",  value: "—",             icon: <BoxIcon />,           color: "#1a5fa8", bg: "rgba(26,95,168,0.07)",   border: "rgba(26,95,168,0.14)"   },
    { label: "Locations",       value: "—",             icon: <MapPinIcon />,        color: "#2d7a3a", bg: "rgba(45,122,58,0.07)",   border: "rgba(45,122,58,0.14)"   },
    { label: "Stock alerts",    value: "—",             icon: <AlertTriangleIcon />, color: "#b07d1a", bg: "rgba(176,125,26,0.07)",  border: "rgba(176,125,26,0.14)"  },
  ];

  return (
    <div className={s.layout}>
      <Sidebar
        activePath="/factory-admin"
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
      />

      <main className={s.main}>
        {/* ── Topbar ── */}
        <header className={s.topbar}>
          <div />
          <div className={s.topbarRight}>
            <button className={s.topbarIcon}><BellIcon /></button>
            <div className={s.topbarAvatar}>
              {(user?.full_name || user?.email || "A")[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className={s.content}>
          {/* ── Welcome ── */}
          <div className={s.welcomeRow}>
            <div>
              <h1 className={s.welcomeTitle}>
                {greeting()}, {user?.full_name?.split(" ")[0] || user?.full_name || "there  "} 👋
              </h1>
              <p className={s.welcomeSub}>
                Here's an overview of your factory workspace today.
              </p>
            </div>
            <div className={s.welcomeDate}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className={s.statsGrid}>
            {STATS.map((st, i) => (
              <StatCard key={i} {...st} loading={loadingStats && i === 0} />
            ))}
          </div>

          {/* ── Section title ── */}
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>Inventory</h2>
            <p className={s.sectionSub}>Jump into any area to manage your factory's resources.</p>
          </div>

          {/* ── Inventory cards ── */}
          <div className={s.inventoryGrid}>
            {INVENTORY_CARDS.map((card, i) => (
              <button
                key={i}
                className={`${s.inventoryCard} ${card.disabled ? s.inventoryCardDisabled : ""}`}
                onClick={() => !card.disabled && navigate(card.path)}
                disabled={card.disabled}
              >
                <div className={s.inventoryCardTop}>
                  <div className={s.inventoryCardIcon} style={{ background: card.bg, color: card.color, border: `1px solid ${card.border}` }}>
                    {card.icon}
                  </div>
                  <span className={s.inventoryCardTag} style={{ color: card.disabled ? "#b8a898" : card.color, background: card.disabled ? "rgba(0,0,0,0.04)" : card.bg, border: `1px solid ${card.disabled ? "rgba(0,0,0,0.06)" : card.border}` }}>
                    {card.tag}
                  </span>
                </div>
                <h3 className={s.inventoryCardTitle}>{card.title}</h3>
                <p className={s.inventoryCardDesc}>{card.desc}</p>
                {!card.disabled && (
                  <div className={s.inventoryCardArrow} style={{ color: card.color }}>
                    Open <ChevronRightIcon />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}