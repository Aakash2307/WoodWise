import React, { useState, useMemo } from "react";
import s from "./Materials.module.css";

const allMaterials = [
  { name: "Sofa Set 3-seater",    sku: "SKU-001", cat: "Seating", loc: "WH-A", qty: 4,  max: 50, value: "₹88,000",    status: "low" },
  { name: "Dining Table 6-seat",  sku: "SKU-002", cat: "Tables",  loc: "WH-B", qty: 0,  max: 30, value: "₹0",         status: "out" },
  { name: "Queen Bed Frame",      sku: "SKU-003", cat: "Beds",    loc: "WH-A", qty: 38, max: 60, value: "₹6,46,000",  status: "ok" },
  { name: "Office Chair (black)", sku: "SKU-004", cat: "Office",  loc: "WH-C", qty: 8,  max: 40, value: "₹72,000",    status: "low" },
  { name: "Bookshelf 5-tier",     sku: "SKU-005", cat: "Storage", loc: "WH-B", qty: 22, max: 35, value: "₹2,20,000",  status: "ok" },
  { name: "Coffee Table round",   sku: "SKU-006", cat: "Tables",  loc: "WH-A", qty: 15, max: 25, value: "₹2,10,000",  status: "ok" },
  { name: "Recliner Sofa single", sku: "SKU-007", cat: "Seating", loc: "WH-C", qty: 3,  max: 20, value: "₹42,000",    status: "low" },
  { name: "King Bed Frame",       sku: "SKU-008", cat: "Beds",    loc: "WH-B", qty: 0,  max: 20, value: "₹0",         status: "out" },
  { name: "Study Desk",           sku: "SKU-009", cat: "Office",  loc: "WH-A", qty: 24, max: 30, value: "₹3,12,000",  status: "ok" },
  { name: "Wardrobe 3-door",      sku: "SKU-010", cat: "Storage", loc: "WH-B", qty: 11, max: 15, value: "₹4,40,000",  status: "ok" },
  { name: "Bar Stool set (2pc)",  sku: "SKU-011", cat: "Seating", loc: "WH-C", qty: 7,  max: 30, value: "₹56,000",    status: "low" },
  { name: "TV Unit large",        sku: "SKU-012", cat: "Storage", loc: "WH-A", qty: 0,  max: 12, value: "₹0",         status: "ordered" },
  { name: "Wooden Bed single",    sku: "SKU-013", cat: "Beds",    loc: "WH-B", qty: 50, max: 60, value: "₹15,00,000", status: "ok" },
  { name: "Ergonomic Chair",      sku: "SKU-014", cat: "Office",  loc: "WH-A", qty: 6,  max: 25, value: "₹84,000",    status: "low" },
  { name: "Console Table",        sku: "SKU-015", cat: "Tables",  loc: "WH-C", qty: 18, max: 20, value: "₹2,52,000",  status: "ok" },
  { name: "Chest of Drawers",     sku: "SKU-016", cat: "Storage", loc: "WH-B", qty: 9,  max: 18, value: "₹1,98,000",  status: "low" },
  { name: "L-shaped Sofa",        sku: "SKU-017", cat: "Seating", loc: "WH-A", qty: 0,  max: 10, value: "₹0",         status: "out" },
  { name: "Dining Chair set (4)", sku: "SKU-018", cat: "Seating", loc: "WH-C", qty: 12, max: 20, value: "₹2,16,000",  status: "ok" },
];

const locations = [
  { name: "Warehouse A", pct: 74, color: "#8B6343" },
  { name: "Warehouse B", pct: 91, color: "#c0392b" },
  { name: "Warehouse C", pct: 48, color: "#2d7a3a" },
  { name: "Showroom",    pct: 63, color: "#1a5fa8" },
];

const activity = [
  { msg: "50 units of Wooden Beds received — Warehouse B", time: "2 hours ago",  color: "#2d7a3a" },
  { msg: "Dining Table 6-seat went out of stock",          time: "5 hours ago",  color: "#c0392b" },
  { msg: "Transfer order #T-0041 raised — WH-A to Showroom", time: "Yesterday", color: "#1a5fa8" },
  { msg: "Office Chair (black) fell below reorder threshold", time: "Yesterday", color: "#b07d1a" },
  { msg: "Reorder placed for Sofa Set 3-seater (×30 units)", time: "2 days ago", color: "#2d7a3a" },
];

const statusConfig = {
  ok:      { label: "Good",    cls: "pillGreen" },
  low:     { label: "Low",     cls: "pillAmber" },
  out:     { label: "Out",     cls: "pillRed" },
  ordered: { label: "Ordered", cls: "pillBlue" },
};

const CATEGORIES = ["All", "Seating", "Beds", "Tables", "Storage", "Office"];
const STATUSES   = [
  { value: "all",     label: "All statuses" },
  { value: "ok",      label: "Good" },
  { value: "low",     label: "Low" },
  { value: "out",     label: "Out of stock" },
  { value: "ordered", label: "Ordered" },
];

export default function Materials() {
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allMaterials.filter(r =>
      (!q || r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)) &&
      (cat === "All" || r.cat === cat) &&
      (statusFilter === "all" || r.status === statusFilter)
    );
  }, [search, cat, statusFilter]);

  const total   = allMaterials.length;
  const good    = allMaterials.filter(r => r.status === "ok").length;
  const low     = allMaterials.filter(r => r.status === "low").length;
  const out     = allMaterials.filter(r => r.status === "out").length;

  return (
    <>
      {/* Page header */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Materials &amp; Inventory</h1>
          <p className={s.pageSub}>All stock levels across warehouses</p>
        </div>
        <div className={s.headerActions}>
          <div className={s.searchWrap}>
            <svg className={s.searchIcon} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6" cy="6" r="4.5" /><line x1="9.5" y1="9.5" x2="12.5" y2="12.5" />
            </svg>
            <input
              type="text"
              className={s.searchInput}
              placeholder="Search materials…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className={s.select} value={cat} onChange={e => setCat(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className={s.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUSES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
          </select>
          <button className={s.btnAdd}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
            </svg>
            Add item
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "#f0e8df" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8B6343" strokeWidth="1.6">
                <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" />
                <path d="M9 1V17M2 5L9 9L16 5" />
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "#f0e8df", color: "#8B6343" }}>SKUs</span>
          </div>
          <div className={s.kpiNumber}>{total}</div>
          <div className={s.kpiLabel}>Total materials</div>
        </div>

        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "var(--green-bg)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--green)" strokeWidth="1.6">
                <path d="M3 7H15V17H3Z" /><path d="M1 7L9 1L17 7" />
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "var(--green-bg)", color: "var(--green)" }}>Ready</span>
          </div>
          <div className={s.kpiNumber} style={{ color: "var(--green)" }}>{good}</div>
          <div className={s.kpiLabel}>Well stocked</div>
        </div>

        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "var(--amber-bg)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--amber)" strokeWidth="1.6">
                <path d="M9 2L16.5 15H1.5L9 2Z" />
                <line x1="9" y1="7" x2="9" y2="11" />
                <circle cx="9" cy="13" r="0.8" fill="var(--amber)" />
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>Alert</span>
          </div>
          <div className={s.kpiNumber} style={{ color: "var(--amber)" }}>{low}</div>
          <div className={s.kpiLabel}>Running low</div>
        </div>

        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "var(--red-bg)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--red)" strokeWidth="1.6">
                <circle cx="9" cy="9" r="7.5" />
                <line x1="9" y1="5" x2="9" y2="10" />
                <circle cx="9" cy="13" r="0.8" fill="var(--red)" />
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "var(--red-bg)", color: "var(--red)" }}>Urgent</span>
          </div>
          <div className={s.kpiNumber} style={{ color: "var(--red)" }}>{out}</div>
          <div className={s.kpiLabel}>Out of stock</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--ink3)" strokeWidth="1.5">
              <rect x="1" y="4" width="13" height="10" rx="1" />
              <path d="M4 4V3a3.5 3.5 0 0 1 7 0v1" />
            </svg>
            Stock inventory
          </span>
          <span className={s.cardBadge}>{filtered.length} items</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Material / Product</th>
                <th>Category</th>
                <th>Location</th>
                <th>Stock level</th>
                <th>Value</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className={s.emptyRow}>No items match your filters.</td>
                </tr>
              ) : (
                filtered.map((item, i) => {
                  const st = statusConfig[item.status];
                  const pct = item.max > 0 ? Math.round((item.qty / item.max) * 100) : 0;
                  const barColor = { ok: "#639922", low: "#BA7517", out: "#E24B4A", ordered: "#378ADD" }[item.status];
                  const needsReorder = item.status === "low" || item.status === "out";
                  return (
                    <tr key={i}>
                      <td>
                        <div className={s.productName}>{item.name}</div>
                        <div className={s.productSku}>{item.sku}</div>
                      </td>
                      <td>{item.cat}</td>
                      <td>{item.loc}</td>
                      <td>
                        <div className={s.stockBarWrap}>
                          <div className={s.stockBarTrack}>
                            <div className={s.stockBarFill} style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                          <span className={s.stockNum}>{item.qty}</span>
                        </div>
                      </td>
                      <td>{item.value}</td>
                      <td>
                        <span className={`${s.pill} ${s[st.cls]}`}>
                          <span className={s.pillDot} />
                          {st.label}
                        </span>
                      </td>
                      <td>
                        {needsReorder
                          ? <button className={s.btnReorder}>Reorder</button>
                          : <button className={s.btnView}>View</button>
                        }
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Capacity + Activity */}
      <div className={s.bottomGrid}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--ink3)" strokeWidth="1.5">
                <path d="M3 6H12V13H3Z" /><path d="M1 6L7.5 1L14 6" />
              </svg>
              Warehouse capacity
            </span>
          </div>
          <div className={s.cardBody}>
            <div className={s.gaugeList}>
              {locations.map((loc, i) => (
                <div key={i} className={s.gaugeItem}>
                  <div className={s.gaugeTop}>
                    <span className={s.gaugeName}>{loc.name}</span>
                    <span className={s.gaugePct} style={loc.pct >= 85 ? { color: "var(--red)" } : {}}>
                      {loc.pct}% full
                    </span>
                  </div>
                  <div className={s.gaugeTrack}>
                    <div className={s.gaugeFill} style={{ width: `${loc.pct}%`, background: loc.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--ink3)" strokeWidth="1.5">
                <circle cx="7.5" cy="7.5" r="6.5" />
                <line x1="7.5" y1="4" x2="7.5" y2="7.5" />
                <line x1="7.5" y1="7.5" x2="10" y2="10" />
              </svg>
              Recent activity
            </span>
            <span className={s.cardBadge}>Today</span>
          </div>
          <div>
            {activity.map((a, i) => (
              <div key={i} className={s.activityItem}>
                <span className={s.activityDot} style={{ background: a.color }} />
                <div>
                  <div className={s.activityText}>{a.msg}</div>
                  <div className={s.activityTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}