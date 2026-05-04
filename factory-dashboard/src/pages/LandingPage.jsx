import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
// ─── font import injected once ────────────────────────────────────────────────
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
`;

// ─── data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "📦",
    title: "Live inventory",
    body: "Track every plank, fitting, and finish in real time — across every floor and shelf.",
  },
  {
    icon: "🏭",
    title: "Multi-location",
    body: "One dashboard for all your warehouses, stores, and factory floors. Zero spreadsheets.",
  },
  {
    icon: "📋",
    title: "Order workflows",
    body: "From purchase order to dispatch, every step is logged, assigned, and on time.",
  },
  {
    icon: "📊",
    title: "Analytics",
    body: "Stock velocity, wastage trends, and supplier performance — all in one view.",
  },
  {
    icon: "🔒",
    title: "Role-based access",
    body: "Factory admins, floor managers, and auditors each see exactly what they need.",
  },
  {
    icon: "⚡",
    title: "Fast onboarding",
    body: "Three steps, under five minutes. Your team is running before the first shift ends.",
  },
];

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "3 min", label: "Avg. onboarding" },
  { value: "40%", label: "Less stock waste" },
  { value: "12k+", label: "SKUs managed" },
];

const TESTIMONIALS = [
  {
    quote: "Switching from Excel was the best call we made. Stock discrepancies dropped to near zero in the first month.",
    name: "Rajan Mehta",
    role: "Operations Head, TimbercraftIndia",
    initials: "RM",
  },
  {
    quote: "The onboarding was shockingly fast. My team was live by afternoon on day one.",
    name: "Sunita Rao",
    role: "Factory Admin, WoodCo Nashik",
    initials: "SR",
  },
  {
    quote: "Multi-location tracking finally makes sense. I can see every warehouse from one screen.",
    name: "Aditya Bhatt",
    role: "Supply Chain Manager, PinewoodPro",
    initials: "AB",
  },
];

// ─── tiny hooks ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── animated counter ─────────────────────────────────────────────────────────
function StatCard({ value, label, delay }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(36px, 5vw, 52px)",
        fontWeight: 600,
        color: "#C0884A",
        lineHeight: 1,
        marginBottom: 6,
      }}>{value}</div>
      <div style={{ fontSize: 13, color: "#9e8a7a", fontWeight: 400, letterSpacing: "0.4px" }}>{label}</div>
    </div>
  );
}

// ─── feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, body, delay, visible }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.6)",
      border: "0.5px solid rgba(192,136,74,0.2)",
      borderRadius: 16,
      padding: "28px 24px",
      backdropFilter: "blur(8px)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    }}>
      <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 20, fontWeight: 600,
        color: "#3d1f08", marginBottom: 8,
      }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#7a6655", lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}

// ─── nav ──────────────────────────────────────────────────────────────────────
function Nav({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: "0 clamp(20px, 5vw, 64px)",
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(245,240,234,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "0.5px solid rgba(192,136,74,0.2)" : "none",
      transition: "background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 22, fontWeight: 600, color: "#3d1f08",
        letterSpacing: "-0.3px",
      }}>
        Wood<span style={{ color: "#C0884A" }}>Wise</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onLogin} style={{
          padding: "7px 18px", background: "transparent",
          border: "0.5px solid #b8956e", borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "#6B3E1E", cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(107,62,30,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          Log in
        </button>
        <button onClick={onSignup} style={{
          padding: "7px 18px", background: "#6B3E1E",
          border: "none", borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "#fff", cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#562f14"}
          onMouseLeave={e => e.currentTarget.style.background = "#6B3E1E"}
        >
          Get started
        </button>
      </div>
    </nav>
  );
}

// ─── hero ─────────────────────────────────────────────────────────────────────
function Hero({ onSignup, onLogin }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f5f0ea 0%, #ede3d6 50%, #f0e8d8 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "100px clamp(20px, 6vw, 80px) 80px",
      position: "relative", overflow: "hidden",
      textAlign: "center",
    }}>
      {/* decorative circles */}
      <div style={{
        position: "absolute", top: "-10%", right: "-8%",
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,136,74,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-5%", left: "-6%",
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(107,62,30,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* grain texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
      }} />

      {/* badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        background: "rgba(192,136,74,0.12)", border: "0.5px solid rgba(192,136,74,0.4)",
        borderRadius: 20, padding: "5px 14px", marginBottom: 28,
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C0884A", display: "inline-block" }} />
        <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#8a5c2e", letterSpacing: "0.5px" }}>
          FACTORY INVENTORY MANAGEMENT
        </span>
      </div>

      {/* headline */}
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(44px, 8vw, 96px)",
        fontWeight: 600, lineHeight: 1.05,
        color: "#2c1a0e", maxWidth: 820,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s",
      }}>
        Your factory floor,
        <br />
        <em style={{ color: "#C0884A", fontStyle: "italic" }}>finally in order.</em>
      </h1>

      {/* sub */}
      <p style={{
        fontSize: "clamp(15px, 2vw, 18px)", color: "#7a6655",
        maxWidth: 520, lineHeight: 1.7, marginBottom: 40,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.65s ease 0.35s, transform 0.65s ease 0.35s",
      }}>
        WoodWise gives wood product manufacturers real-time inventory control,
        multi-location visibility, and workflow automation — built for the shop floor.
      </p>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.65s ease 0.48s, transform 0.65s ease 0.48s",
      }}>
        <button onClick={onSignup} style={{
          padding: "13px 32px", background: "#6B3E1E",
          color: "#fff", border: "none", borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
          cursor: "pointer", transition: "background 0.2s, transform 0.15s",
          boxShadow: "0 4px 24px rgba(107,62,30,0.28)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#562f14"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#6B3E1E"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Start free — no card needed
        </button>
        <button onClick={onLogin} style={{
          padding: "13px 32px", background: "transparent",
          color: "#6B3E1E", border: "1px solid #b8956e", borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 400,
          cursor: "pointer", transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(107,62,30,0.06)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          Log in to your account
        </button>
      </div>

      {/* scroll nudge */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: 0.45,
        animation: "ww-bounce 2.2s ease-in-out infinite",
      }}>
        <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "1px", color: "#8a7060" }}>SCROLL</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="6" y="2" width="4" height="8" rx="2" fill="#8a7060" opacity="0.5" />
          <path d="M8 14l-4 5h8l-4-5z" fill="#8a7060" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}

// ─── stats band ───────────────────────────────────────────────────────────────
function StatsBand() {
  return (
    <section style={{
      background: "#2c1a0e",
      padding: "56px clamp(20px, 6vw, 80px)",
    }}>
      <div style={{
        maxWidth: 860, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "32px 24px",
      }}>
        {STATS.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
      </div>
    </section>
  );
}

// ─── features ─────────────────────────────────────────────────────────────────
function Features() {
  const [ref, visible] = useInView(0.1);
  return (
    <section ref={ref} style={{
      padding: "96px clamp(20px, 6vw, 80px)",
      background: "#f5f0ea",
    }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: "#C0884A", letterSpacing: "1.5px",
            textTransform: "uppercase", marginBottom: 14,
            opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.1s",
          }}>Everything you need</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600,
            color: "#2c1a0e", lineHeight: 1.15,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}>
            Built for factories.<br />
            <em style={{ color: "#C0884A" }}>Not for spreadsheets.</em>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} delay={0.1 + i * 0.08} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── how it works ─────────────────────────────────────────────────────────────
function HowItWorks({ onSignup }) {
  const [ref, visible] = useInView(0.15);
  const steps = [
    { num: "01", title: "Sign up as factory admin", desc: "Create your account in under a minute. No credit card required." },
    { num: "02", title: "Add your company profile", desc: "Enter GSTIN & PAN for compliance. Takes 30 seconds." },
    { num: "03", title: "Set up locations", desc: "Add warehouses, stores, or factory floors." },
    { num: "04", title: "Seed your database", desc: "We auto-generate default categories, units, and templates." },
  ];

  return (
    <section ref={ref} style={{
      padding: "96px clamp(20px, 6vw, 80px)",
      background: "linear-gradient(160deg, #ede3d6 0%, #f5f0ea 100%)",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: "#C0884A", letterSpacing: "1.5px",
            textTransform: "uppercase", marginBottom: 14,
          }}>Onboard in minutes</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 600,
            color: "#2c1a0e", lineHeight: 1.15,
          }}>Four steps to a running factory</h2>
        </div>

        <div style={{ position: "relative" }}>
          {/* vertical line */}
          <div style={{
            position: "absolute", left: 24, top: 24, bottom: 24,
            width: 1, background: "rgba(192,136,74,0.25)",
          }} />

          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 28, marginBottom: i < steps.length - 1 ? 40 : 0,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transition: `opacity 0.55s ease ${0.1 + i * 0.12}s, transform 0.55s ease ${0.1 + i * 0.12}s`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#6B3E1E", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500,
                flexShrink: 0, zIndex: 1,
                boxShadow: "0 2px 12px rgba(107,62,30,0.25)",
              }}>{s.num}</div>

              <div style={{ paddingTop: 10 }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20, fontWeight: 600, color: "#2c1a0e", marginBottom: 6,
                }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#7a6655", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <button onClick={onSignup} style={{
            padding: "13px 36px", background: "#6B3E1E",
            color: "#fff", border: "none", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
            cursor: "pointer", transition: "background 0.2s, transform 0.15s",
            boxShadow: "0 4px 20px rgba(107,62,30,0.22)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#562f14"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#6B3E1E"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Get started free →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [ref, visible] = useInView(0.1);
  return (
    <section ref={ref} style={{
      padding: "96px clamp(20px, 6vw, 80px)",
      background: "#2c1a0e",
    }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: "#C0884A", letterSpacing: "1.5px",
            textTransform: "uppercase", marginBottom: 14,
          }}>From the shop floor</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600,
            color: "#f5f0ea", lineHeight: 1.2,
          }}>Trusted by factory teams</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(192,136,74,0.18)",
              borderRadius: 16, padding: "28px 24px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: `opacity 0.55s ease ${0.1 + i * 0.1}s, transform 0.55s ease ${0.1 + i * 0.1}s`,
            }}>
              {/* quote mark */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 56, lineHeight: 0.7, color: "#C0884A",
                marginBottom: 16, opacity: 0.6,
              }}>"</div>
              <p style={{
                fontSize: 14, color: "#d4c4b0",
                lineHeight: 1.7, marginBottom: 20,
                fontFamily: "'DM Sans', sans-serif",
              }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(192,136,74,0.18)",
                  border: "0.5px solid rgba(192,136,74,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#C0884A",
                }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#f5f0ea" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#9e8a7a" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA footer ───────────────────────────────────────────────────────────────
function CtaFooter({ onSignup, onLogin }) {
  const [ref, visible] = useInView(0.2);
  return (
    <section ref={ref} style={{
      padding: "96px clamp(20px, 6vw, 80px)",
      background: "#f5f0ea",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 600,
          color: "#2c1a0e", lineHeight: 1.1, marginBottom: 18,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}>
          Ready to take<br />
          <em style={{ color: "#C0884A" }}>control of your floor?</em>
        </h2>
        <p style={{
          fontSize: 15, color: "#7a6655", lineHeight: 1.7,
          marginBottom: 36,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.25s",
        }}>
          Join hundreds of wood product manufacturers already managing
          inventory, orders, and teams with WoodWise.
        </p>
        <div style={{
          display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.38s",
        }}>
          <button onClick={onSignup} style={{
            padding: "13px 36px", background: "#6B3E1E",
            color: "#fff", border: "none", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
            cursor: "pointer", transition: "background 0.2s, transform 0.15s",
            boxShadow: "0 4px 20px rgba(107,62,30,0.25)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#562f14"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#6B3E1E"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Create free account
          </button>
          <button onClick={onLogin} style={{
            padding: "13px 32px", background: "transparent",
            color: "#6B3E1E", border: "1px solid #b8956e", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15,
            cursor: "pointer", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(107,62,30,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Log in
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── footer bar ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: "#1e1008",
      padding: "28px clamp(20px, 6vw, 80px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 12,
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18, fontWeight: 600, color: "#f5f0ea",
      }}>
        Wood<span style={{ color: "#C0884A" }}>Wise</span>
      </div>
      <p style={{ fontSize: 12, color: "#6b5a4e", fontFamily: "'DM Sans', sans-serif" }}>
        © {new Date().getFullYear()} WoodWise. Built for the factory floor.
      </p>
    </footer>
  );
}

// ─── root ─────────────────────────────────────────────────────────────────────
export default function LandingPage({ onLogin, onSignup }) {
  const navigate = useNavigate();
  return (
    <>

      
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        @keyframes ww-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>

      <Nav onLogin={onLogin} onSignup={onSignup} />
      <Hero onSignup={onSignup} onLogin={onLogin} />
      <StatsBand />
      <Features />
      <HowItWorks onSignup={onSignup} />
      <Testimonials />
      <CtaFooter onSignup={onSignup} onLogin={onLogin} />
      <Footer />
    </>
  );
}