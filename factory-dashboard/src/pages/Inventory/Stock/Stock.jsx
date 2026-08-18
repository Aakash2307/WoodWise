import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout, getTransactions, getItems } from "../../../api";
import Sidebar from "../../../components/Sidebar/Sidebar";
import s from "../Stock/Stockoverview.module.css";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowDownIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const EmptyBoxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ label, value, icon, color, bg, border, loading }) {
  return (
    <div className={s.summaryCard} style={{ borderColor: border }}>
      <div className={s.summaryIcon} style={{ background: bg, color }}>
        {icon}
      </div>
      <div className={s.summaryBody}>
        <div className={s.summaryLabel}>{label}</div>
        {loading
          ? <div className={s.skeleton} />
          : <div className={s.summaryValue}>{value ?? "—"}</div>
        }
      </div>
    </div>
  );
}

function TypeBadge({ type }) {
  const isInward = type === "inward";
  return (
    <span className={`${s.badge} ${isInward ? s.badgeInward : s.badgeOutward}`}>
      {isInward ? <ArrowDownIcon /> : <ArrowUpIcon />}
      {isInward ? "Inward" : "Outward"}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StockOverview() {
  const navigate = useNavigate();
  const [user, setUser]                   = useState(null);
  const [transactions, setTransactions]   = useState([]);
  const [items, setItems]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  // Filters
  const [filterItemId, setFilterItemId]   = useState("");
  const [filterType, setFilterType]       = useState(""); // "" | "inward" | "outward"

  // ── Load user ──
  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
  }, []);

  // ── Fetch items for filter dropdown ──
  useEffect(() => {
    getItems()
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // ── Fetch transactions ──
  const fetchTransactions = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = {};
    if (filterItemId) params.item_id = filterItemId;
    if (filterType)   params.transaction_type = filterType;

    getTransactions(params)
      .then(data => setTransactions(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || "Failed to load transactions"))
      .finally(() => setLoading(false));
  }, [filterItemId, filterType]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── Derived stats ──
  const totalInward  = transactions.filter(t => t.transaction_type === "inward").reduce((sum, t) => sum + (t.quantity || 0), 0);
  const totalOutward = transactions.filter(t => t.transaction_type === "outward").reduce((sum, t) => sum + (t.quantity || 0), 0);
  const netStock     = totalInward - totalOutward;

  const SUMMARY = [
    {
      label: "Total Transactions",
      value: transactions.length,
      icon: <PackageIcon />,
      color: "#8B6343",
      bg: "rgba(139,99,67,0.08)",
      border: "rgba(139,99,67,0.18)",
    },
    {
      label: "Total Inward",
      value: totalInward,
      icon: <ArrowDownIcon />,
      color: "#2d7a3a",
      bg: "rgba(45,122,58,0.08)",
      border: "rgba(45,122,58,0.18)",
    },
    {
      label: "Total Outward",
      value: totalOutward,
      icon: <ArrowUpIcon />,
      color: "#b5341a",
      bg: "rgba(181,52,26,0.08)",
      border: "rgba(181,52,26,0.18)",
    },
    {
      label: "Net Stock Movement",
      value: netStock >= 0 ? `+${netStock}` : `${netStock}`,
      icon: <PackageIcon />,
      color: netStock >= 0 ? "#2d7a3a" : "#b5341a",
      bg: netStock >= 0 ? "rgba(45,122,58,0.08)" : "rgba(181,52,26,0.08)",
      border: netStock >= 0 ? "rgba(45,122,58,0.18)" : "rgba(181,52,26,0.18)",
    },
  ];

  return (
    <div className={s.layout}>
      <Sidebar user={user} onLogout={handleLogout} />

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
          {/* ── Page Header ── */}
          <div className={s.pageHeader}>
            <div>
              <h1 className={s.pageTitle}>Stock Overview</h1>
              <p className={s.pageSub}>Track all inward and outward inventory movements.</p>
            </div>
            <button className={s.refreshBtn} onClick={fetchTransactions} disabled={loading}>
              <span className={loading ? s.spinning : ""}><RefreshIcon /></span>
              Refresh
            </button>
          </div>

          {/* ── Summary Cards ── */}
          <div className={s.summaryGrid}>
            {SUMMARY.map((card, i) => (
              <SummaryCard key={i} {...card} loading={loading} />
            ))}
          </div>

          {/* ── Filters ── */}
          <div className={s.filterBar}>
            <div className={s.filterLeft}>
              <FilterIcon />
              <span className={s.filterLabel}>Filter by:</span>
            </div>

            {/* Item filter */}
            <select
              className={s.filterSelect}
              value={filterItemId}
              onChange={e => setFilterItemId(e.target.value)}
            >
              <option value="">All Items</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>

            {/* Type filter */}
            <div className={s.typeToggle}>
              {["", "inward", "outward"].map(type => (
                <button
                  key={type}
                  className={`${s.typeBtn} ${filterType === type ? s.typeBtnActive : ""} ${
                    type === "inward" ? s.typeBtnInward :
                    type === "outward" ? s.typeBtnOutward : ""
                  } ${filterType === type && type === "inward" ? s.typeBtnInwardActive :
                     filterType === type && type === "outward" ? s.typeBtnOutwardActive : ""}`}
                  onClick={() => setFilterType(type)}
                >
                  {type === "" && "All"}
                  {type === "inward" && <><ArrowDownIcon /> Inward</>}
                  {type === "outward" && <><ArrowUpIcon /> Outward</>}
                </button>
              ))}
            </div>

            {(filterItemId || filterType) && (
              <button
                className={s.clearBtn}
                onClick={() => { setFilterItemId(""); setFilterType(""); }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* ── Table ── */}
          <div className={s.tableWrapper}>
            {error ? (
              <div className={s.errorState}>
                <p>{error}</p>
                <button className={s.retryBtn} onClick={fetchTransactions}>Retry</button>
              </div>
            ) : loading ? (
              <div className={s.tableSkeletonWrap}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={s.rowSkeleton} style={{ opacity: 1 - i * 0.12 }} />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className={s.emptyState}>
                <div className={s.emptyIcon}><EmptyBoxIcon /></div>
                <p className={s.emptyTitle}>No transactions found</p>
                <p className={s.emptySub}>
                  {filterItemId || filterType
                    ? "Try adjusting your filters."
                    : "Stock movements will appear here once recorded."}
                </p>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th className={s.th}>#</th>
                    <th className={s.th}>Item</th>
                    <th className={s.th}>Type</th>
                    <th className={s.th}>Quantity</th>
                    <th className={s.th}>Reference</th>
                    <th className={s.th}>Remarks</th>
                    <th className={s.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={tx.id ?? i} className={s.tr}>
                      <td className={`${s.td} ${s.tdMuted}`}>{i + 1}</td>
                      <td className={s.td}>
                        <span className={s.itemName}>{tx.item_name || tx.item?.name || `Item #${tx.item_id}`}</span>
                      </td>
                      <td className={s.td}>
                        <TypeBadge type={tx.transaction_type} />
                      </td>
                      <td className={s.td}>
                        <span className={`${s.qty} ${tx.transaction_type === "inward" ? s.qtyInward : s.qtyOutward}`}>
                          {tx.transaction_type === "inward" ? "+" : "−"}{tx.quantity}
                          {tx.unit_of_measure && <span className={s.uom}>{tx.unit_of_measure}</span>}
                        </span>
                      </td>
                      <td className={s.td}>
                        <span className={s.refNum}>{tx.reference_number || "—"}</span>
                      </td>
                      <td className={s.td}>
                        <span className={s.remarks}>{tx.remarks || "—"}</span>
                      </td>
                      <td className={s.td}>
                        <div className={s.dateCell}>
                          <span>{formatDate(tx.created_at || tx.date)}</span>
                          <span className={s.timeStr}>{formatTime(tx.created_at || tx.date)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Row count ── */}
          {!loading && !error && transactions.length > 0 && (
            <p className={s.rowCount}>
              Showing <strong>{transactions.length}</strong> transaction{transactions.length !== 1 ? "s" : ""}
              {(filterItemId || filterType) && " (filtered)"}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}