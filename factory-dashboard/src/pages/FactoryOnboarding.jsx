import { useState } from "react";
import api from "../api"; // ← your axios instance (token attached automatically)

// ─── Validation ───────────────────────────────────────────────────────────────
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_RE   = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// ─── Shared UI components ─────────────────────────────────────────────────────

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 16, height: 16,
      border: "2px solid rgba(255,255,255,0.35)",
      borderTopColor: "#fff", borderRadius: "50%",
      animation: "ww-spin 0.7s linear infinite",
    }} />
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p style={{ fontSize: 12, color: "#c0392b", marginTop: 4 }}>{msg}</p>;
}

function ApiError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      marginTop: 12, padding: "10px 12px",
      background: "#fff0f0", border: "0.5px solid #f5c6c6",
      borderRadius: 8, fontSize: 13, color: "#c0392b",
    }}>
      {msg}
    </div>
  );
}

function PrimaryBtn({ onClick, loading, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        width: "100%", padding: "11px 0",
        background: loading || disabled ? "#c5a882" : "#6B3E1E",
        color: "#fff", border: "none", borderRadius: 8,
        fontFamily: "inherit", fontSize: 14, fontWeight: 500,
        cursor: loading || disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, marginTop: 20, transition: "background 0.2s",
      }}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

function InputField({ label, id, value, onChange, placeholder, maxLength, error, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{
        display: "block", fontSize: 11, fontWeight: 500,
        color: "#8a7060", textTransform: "uppercase",
        letterSpacing: "0.6px", marginBottom: 6,
      }}>
        {label}
      </label>
      <input
        id={id} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "10px 12px",
          border: `1px solid ${error ? "#e74c3c" : focused ? "#C0884A" : "#e0d5c8"}`,
          borderRadius: 8, fontSize: 14, fontFamily: "inherit",
          background: "#faf8f5", color: "#2c1a0e",
          outline: "none", boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(192,136,74,0.14)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      <FieldError msg={error} />
    </div>
  );
}

function SelectField({ label, id, value, onChange, options, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{
        display: "block", fontSize: 11, fontWeight: 500,
        color: "#8a7060", textTransform: "uppercase",
        letterSpacing: "0.6px", marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          id={id} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "10px 36px 10px 12px",
            border: `1px solid ${error ? "#e74c3c" : focused ? "#C0884A" : "#e0d5c8"}`,
            borderRadius: 8, fontSize: 14, fontFamily: "inherit",
            background: "#faf8f5", color: value ? "#2c1a0e" : "#9e8a7a",
            outline: "none", appearance: "none", boxSizing: "border-box",
            boxShadow: focused ? "0 0 0 3px rgba(192,136,74,0.14)" : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            cursor: "pointer",
          }}
        >
          <option value="">Select type</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          width="12" height="8" viewBox="0 0 12 8" fill="none"
        >
          <path d="M1 1l5 5 5-5" stroke="#9e8a7a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <FieldError msg={error} />
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = ["Company profile", "Add location", "Seed database"];

function Stepper({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28, width: "100%" }}>
      {STEPS.map((label, i) => {
        const num  = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: done ? "#4A7C59" : active ? "#6B3E1E" : "transparent",
                border: `1.5px solid ${done ? "#4A7C59" : active ? "#6B3E1E" : "#c5b8aa"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 500,
                color: done || active ? "#fff" : "#9e8a7a",
                transition: "all 0.3s",
              }}>
                {done
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  : num}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: done ? "#4A7C59" : active ? "#6B3E1E" : "#9e8a7a",
                whiteSpace: "nowrap",
              }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 1.5, marginBottom: 16, marginLeft: 6, marginRight: 6,
                background: done ? "#4A7C59" : "#e0d5c8",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Company Profile ──────────────────────────────────────────────────

function Step1({ onSuccess }) {
  const [gstin, setGstin]   = useState("");
  const [pan, setPan]       = useState("");
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!gstin.trim()) e.gstin = "GSTIN is required";
    else if (!GSTIN_RE.test(gstin.trim().toUpperCase())) e.gstin = "Enter a valid 15-character GSTIN";
    if (!pan.trim()) e.pan = "PAN number is required";
    else if (!PAN_RE.test(pan.trim().toUpperCase())) e.pan = "Enter a valid 10-character PAN";
    return e;
  };

  const submit = async () => {
    setApiErr("");
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.put("/company/onboarding/step-1-profile", {
        gstin: gstin.trim().toUpperCase(),
        pan_number: pan.trim().toUpperCase(),
      });
      onSuccess();
    } catch (err) {
      setApiErr(err.response?.data?.detail || err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#6B3E1E", marginBottom: 6 }}>
        Company profile
      </h2>
      <p style={{ fontSize: 13, color: "#8a7060", marginBottom: 20, lineHeight: 1.6 }}>
        Enter your company's tax identifiers for invoicing and compliance.
      </p>

      <InputField
        label="GSTIN" id="gstin" value={gstin}
        onChange={v => { setGstin(v); setErrors(e => ({ ...e, gstin: "" })); }}
        placeholder="e.g. 22AAAAA0000A1Z5"
        maxLength={15} error={errors.gstin}
      />
      <InputField
        label="PAN number" id="pan" value={pan}
        onChange={v => { setPan(v); setErrors(e => ({ ...e, pan: "" })); }}
        placeholder="e.g. AAAAA0000A"
        maxLength={10} error={errors.pan}
      />

      <ApiError msg={apiErr} />
      <PrimaryBtn onClick={submit} loading={loading}>Continue</PrimaryBtn>
    </>
  );
}

// ─── Step 2: Add Location ─────────────────────────────────────────────────────

function Step2({ onSuccess }) {
  const [name, setName]     = useState("");
  const [type, setType]     = useState("");
  const [addr, setAddr]     = useState("");
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [added, setAdded]   = useState([]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Location name is required";
    if (!type)        e.type = "Please select a location type";
    if (!addr.trim()) e.addr = "Address is required";
    return e;
  };

  const submit = async () => {
    setApiErr("");
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/company/onboarding/step-2-locations", {
        name: name.trim(),
        location_type: type,
        address: addr.trim(),
      });
      setAdded(prev => [...prev, { name: name.trim(), type }]);
      setName(""); setType(""); setAddr("");
      onSuccess();
    } catch (err) {
      setApiErr(err.response?.data?.detail || err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#6B3E1E", marginBottom: 6 }}>
        Add a location
      </h2>
      <p style={{ fontSize: 13, color: "#8a7060", marginBottom: 16, lineHeight: 1.6 }}>
        Add your first warehouse, store, or factory floor. More can be added later from settings.
      </p>

      {added.length > 0 && (
        <div style={{ marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {added.map((l, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(107,62,30,0.07)", border: "0.5px solid rgba(192,136,74,0.35)",
              borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#6B3E1E",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C0884A", display: "inline-block" }} />
              {l.name} · {l.type}
            </span>
          ))}
        </div>
      )}

      <InputField
        label="Location name" id="loc-name" value={name}
        onChange={v => { setName(v); setErrors(e => ({ ...e, name: "" })); }}
        placeholder="e.g. Main Warehouse" error={errors.name}
      />
      <SelectField
        label="Location type" id="loc-type" value={type}
        onChange={v => { setType(v); setErrors(e => ({ ...e, type: "" })); }}
        options={["Store", "Warehouse", "Factory", "Distribution Center"]}
        error={errors.type}
      />
      <InputField
        label="Address" id="loc-addr" value={addr}
        onChange={v => { setAddr(v); setErrors(e => ({ ...e, addr: "" })); }}
        placeholder="e.g. Ghansoli, Navi Mumbai" error={errors.addr}
      />

      <ApiError msg={apiErr} />
      <PrimaryBtn onClick={submit} loading={loading}>Add location &amp; continue</PrimaryBtn>
    </>
  );
}

// ─── Step 3: Seed Database ────────────────────────────────────────────────────

function Step3({ onSuccess }) {
  const [apiErr, setApiErr]     = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    setApiErr("");
    setLoading(true);
    try {
      await api.post("/company/onboarding/step-3-seed");
      onSuccess();
    } catch (err) {
      setApiErr(err.response?.data?.detail || err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#6B3E1E", marginBottom: 6 }}>
        Initialize database
      </h2>
      <p style={{ fontSize: 13, color: "#8a7060", marginBottom: 16, lineHeight: 1.6 }}>
        We'll auto-generate your initial configuration — default product categories,
        units of measure, and workflow templates.
      </p>

      <div style={{
        background: "rgba(107,62,30,0.06)", border: "0.5px solid rgba(192,136,74,0.3)",
        borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#6B3E1E", lineHeight: 1.6,
      }}>
        This is a one-time setup. Your database will be seeded with sensible defaults
        that you can customize anytime from settings.
      </div>

      <ApiError msg={apiErr} />
      <PrimaryBtn onClick={submit} loading={loading}>Initialize &amp; finish</PrimaryBtn>
    </>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────

function SuccessScreen({ onGoToDashboard }) {
  return (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(74,124,89,0.1)", border: "1.5px solid #4A7C59",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontSize: 22,
        color: "#4A7C59", marginBottom: 8,
      }}>
        You're all set!
      </h2>
      <p style={{ fontSize: 14, color: "#8a7060", lineHeight: 1.6, maxWidth: 300, margin: "0 auto 24px" }}>
        Your factory workspace is ready. Head to your dashboard to start managing
        inventory and orders.
      </p>
      <button
        onClick={onGoToDashboard}
        style={{
          padding: "11px 32px", background: "#6B3E1E",
          color: "#fff", border: "none", borderRadius: 8,
          fontFamily: "inherit", fontSize: 14, fontWeight: 500,
          cursor: "pointer", transition: "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#562f14"}
        onMouseLeave={e => e.currentTarget.style.background = "#6B3E1E"}
      >
        Go to dashboard →
      </button>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function FactoryOnboarding({ onComplete }) {
  const [step, setStep] = useState(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Playfair+Display:wght@600&display=swap');
        @keyframes ww-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#f5f0ea",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px", fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: 480 }}>

          {/* Brand header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 24,
              color: "#6B3E1E", marginBottom: 4,
            }}>
              Wood<span style={{ color: "#C0884A" }}>Wise</span>
            </div>
            <p style={{ fontSize: 13, color: "#9e8a7a" }}>Let's set up your factory workspace</p>
          </div>

          {/* Card */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "0.5px solid #e0d5c8",
            padding: "28px 28px 24px",
            boxShadow: "0 2px 16px rgba(107,62,30,0.07)",
          }}>
            {step <= 3 && <Stepper current={step} />}

            {step === 1 && <Step1 onSuccess={() => setStep(2)} />}
            {step === 2 && <Step2 onSuccess={() => setStep(3)} />}
            {step === 3 && <Step3 onSuccess={() => setStep(4)} />}
            {step === 4 && <SuccessScreen onGoToDashboard={() => onComplete?.()} />}
          </div>

        </div>
      </div>
    </>
  );
}