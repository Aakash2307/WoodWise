import React from "react";
import s from "./Dashboard.module.css";

const barData = [
  { label: "Wk 1", value: 42 },
  { label: "Wk 2", value: 61 },
  { label: "Wk 3", value: 55 },
  { label: "Wk 4", value: 78 },
  { label: "Wk 5", value: 48 },
  { label: "This wk", value: 33 },
];

const alerts = [
  { msg: "Sofa Set 3-seater — almost finished",     meta: "Only 4 left · Warehouse A",       color: "#c0392b" },
  { msg: "Dining Table 6-seat — out of stock",       meta: "0 left · Order needed",            color: "#c0392b" },
  { msg: "Office Chair (black) — running low",       meta: "8 left · Reorder soon",            color: "#b07d1a" },
  { msg: "50 units of Wooden Beds arrived",          meta: "Added today · Warehouse B",        color: "#2d7a3a" },
  { msg: "3 stock transfer orders waiting",          meta: "Move stock between locations",     color: "#1a5fa8" },
];

const products = [
  { name: "Sofa Set 3-seater",    qty: 4,    loc: "WH-A", status: "low" },
  { name: "Dining Table 6-seat",  qty: 0,    loc: "WH-B", status: "out" },
  { name: "Queen Bed Frame",      qty: 38,   loc: "WH-A", status: "ok" },
  { name: "Office Chair",         qty: 8,    loc: "WH-C", status: "low" },
  { name: "Bookshelf 5-tier",     qty: 22,   loc: "WH-B", status: "ok" },
];

const locations = [
  { name: "Warehouse A",   pct: 74, color: "#8B6343" },
  { name: "Warehouse B",   pct: 91, color: "#c0392b" },
  { name: "Warehouse C",   pct: 48, color: "#2d7a3a" },
  { name: "Showroom",      pct: 63, color: "#1a5fa8" },
];

const statusConfig = {
  ok:  { label: "Good",  cls: "pillGreen" },
  low: { label: "Low",   cls: "pillAmber" },
  out: { label: "Out",   cls: "pillRed"   },
};

const maxBar = Math.max(...barData.map(d => d.value));

export default function Dashboard() {
  return (
    <>
      {/* KPI Cards */}
      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "#f0e8df" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8B6343" strokeWidth="1.6">
                <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z"/>
                <path d="M9 1V17M2 5L9 9L16 5"/>
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "#f0e8df", color: "#8B6343" }}>Total</span>
          </div>
          <div className={s.kpiNumber}>248</div>
          <div className={s.kpiLabel}>Products in stock</div>
        </div>

        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "var(--green-bg)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--green)" strokeWidth="1.6">
                <path d="M3 7H15V17H3Z"/><path d="M1 7L9 1L17 7"/>
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "var(--green-bg)", color: "var(--green)" }}>Good</span>
          </div>
          <div className={s.kpiNumber} style={{ color: "var(--green)" }}>211</div>
          <div className={s.kpiLabel}>In stock & ready</div>
        </div>

        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "var(--amber-bg)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--amber)" strokeWidth="1.6">
                <path d="M9 2L16.5 15H1.5L9 2Z"/>
                <line x1="9" y1="7" x2="9" y2="11"/>
                <circle cx="9" cy="13" r="0.8" fill="var(--amber)"/>
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>Check</span>
          </div>
          <div className={s.kpiNumber} style={{ color: "var(--amber)" }}>29</div>
          <div className={s.kpiLabel}>Running low</div>
        </div>

        <div className={s.kpiCard}>
          <div className={s.kpiIconRow}>
            <div className={s.kpiIcon} style={{ background: "var(--red-bg)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--red)" strokeWidth="1.6">
                <circle cx="9" cy="9" r="7.5"/>
                <line x1="9" y1="5" x2="9" y2="10"/>
                <circle cx="9" cy="13" r="0.8" fill="var(--red)"/>
              </svg>
            </div>
            <span className={s.kpiTag} style={{ background: "var(--red-bg)", color: "var(--red)" }}>Urgent</span>
          </div>
          <div className={s.kpiNumber} style={{ color: "var(--red)" }}>8</div>
          <div className={s.kpiLabel}>Out of stock</div>
        </div>
      </div>

      {/* Chart + Alerts */}
      <div className={s.contentGrid}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--ink3)" strokeWidth="1.5">
                <path d="M1 13V5L7.5 1L14 5V13"/><rect x="5" y="8" width="5" height="5"/>
              </svg>
              Items sold this month
            </span>
            <span className={s.cardBadge}>Aug 2025</span>
          </div>
          <div className={s.cardBody}>
            <div className={s.chartBars}>
              {barData.map((d, i) => {
                const isLast = i === barData.length - 1;
                const pct = Math.round((d.value / maxBar) * 100);
                const bg = isLast
                  ? "#c9a882"
                  : `rgba(139,99,67,${(0.22 + (d.value / maxBar) * 0.55).toFixed(2)})`;
                return (
                  <div key={d.label} className={s.bar}>
                    <div className={s.barFill} style={{ height: `${pct}%`, background: bg }}>
                      <span className={s.barLabel}>{d.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--ink3)" strokeWidth="1.5">
                <circle cx="7.5" cy="7.5" r="6.5"/><line x1="7.5" y1="4" x2="7.5" y2="7.5"/><line x1="7.5" y1="7.5" x2="10" y2="10"/>
              </svg>
              What needs attention
            </span>
            <span className={s.cardBadge} style={{ background: "var(--red-bg)", color: "var(--red)" }}>
              5 alerts
            </span>
          </div>
          <div>
            {alerts.map((a, i) => (
              <div key={i} className={s.alertItem}>
                <span className={s.alertDot} style={{ background: a.color }} />
                <div>
                  <div className={s.alertText}>{a.msg}</div>
                  <div className={s.alertMeta}>{a.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table + Gauges */}
      <div className={s.bottomGrid}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--ink3)" strokeWidth="1.5">
                <path d="M9 1L14 4V11L9 14L4 11V4L9 1Z"/>
              </svg>
              Product stock levels
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Product name</th>
                  <th>Qty</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const st = statusConfig[p.status];
                  return (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.qty}</td>
                      <td>{p.loc}</td>
                      <td>
                        <span className={`${s.pill} ${s[st.cls]}`}>
                          <span className={s.pillDot} />
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--ink3)" strokeWidth="1.5">
                <path d="M3 6H12V13H3Z"/><path d="M1 6L7.5 1L14 6"/>
              </svg>
              Storage space used
            </span>
          </div>
          <div className={s.cardBody}>
            <div className={s.gaugeList}>
              {locations.map((loc, i) => (
                <div key={i} className={s.gaugeItem}>
                  <div className={s.gaugeTop}>
                    <span className={s.gaugeName}>{loc.name}</span>
                    <span className={s.gaugePct}>{loc.pct}% full</span>
                  </div>
                  <div className={s.gaugeTrack}>
                    <div className={s.gaugeFill} style={{ width: `${loc.pct}%`, background: loc.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
