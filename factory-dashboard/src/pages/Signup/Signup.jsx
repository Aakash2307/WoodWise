import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import s from "./Signup.module.css";


import { signup } from "../../api";
const ROLES = [
  {
    key: "factory_admin",
    label: "Factory Admin",
    desc: "Full access to your factory",
    color: "#2d7a3a",
    bg: "#eaf3de",
  },
  {
    key: "manager",
    label: "Manager",
    desc: "Floor & production oversight",
    color: "#1a5fa8",
    bg: "#dceeff",
  },
  {
    key: "accountant",
    label: "Accountant",
    desc: "Billing and finance access",
    color: "#b07d1a",
    bg: "#faeeda",
  },
  {
    key: "clerk",
    label: "Clerk",
    desc: "Inventory & dispatch",
    color: "#7a3a8a",
    bg: "#f3e8f8",
  },
];

// system_admin is not self-registerable — created by super admin only
const ROLE_NOTE = "system_admin accounts are created by the platform administrator only.";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = role select, 2 = details
  const [selectedRole, setSelectedRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    factoryName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleNext = () => {
    if (!selectedRole) { setError("Please select a role to continue."); return; }
    setError("");
    setStep(2);
  };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!form.name || !form.email || !form.password || !form.confirmPassword) {
//       setError("Please fill in all fields.");
//       return;
//     }
//     if (selectedRole === "factory_admin" && !form.factoryName) {
//       setError("Please enter your factory name.");
//       return;
//     }
//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (form.password.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       // TODO: replace with real API call
//       // const res = await api.post("/auth/register", {
//       //   name: form.name,
//       //   email: form.email,
//       //   password: form.password,
//       //   role: selectedRole,
//       //   ...(selectedRole === "factory_admin" && { factoryName: form.factoryName }),
//       // });
//       await new Promise(r => setTimeout(r, 1000));
//       navigate("/");
//     } catch (err) {
//       setError(err?.response?.data?.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
const handleSubmit = async e => {
  e.preventDefault();
  if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    setError("Please fill in all fields."); return;
  }
  if (!form.companyName) {
    setError("Please enter your company name."); return;
  }
  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match."); return;
  }
  if (form.password.length < 8) {
    setError("Password must be at least 8 characters."); return;
  }
  setLoading(true);
  setError("");
  try {
    await signup({
      email:       form.email,
      password:    form.password,
      fullName:    form.name,
      companyName: form.companyName,
    });
    // Signup doesn't return a token — redirect to login
    navigate("/login");
  } catch (err) {
    setError(err?.response?.data?.detail || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};
  const roleObj = ROLES.find(r => r.key === selectedRole);

  return (
    <div className={s.page}>
      <div className={s.left}>
        <div className={s.brand}>
          <div className={s.brandMark}><SofaIcon /></div>
          <span className={s.brandName}>WoodWise</span>
        </div>
        <div className={s.tagline}>
          <h1 className={s.taglineHead}>Your factory,<br />your dashboard.</h1>
          <p className={s.taglineSub}>Set up your account in under 2 minutes and get full visibility into your inventory.</p>
        </div>
        <div className={s.stepList}>
          <div className={`${s.stepItem} ${step >= 1 ? s.stepDone : ""}`}>
            <div className={s.stepCircle}>1</div>
            <div>
              <div className={s.stepLabel}>Choose your role</div>
              <div className={s.stepHint}>Determines your access level</div>
            </div>
          </div>
          <div className={s.stepLine} />
          <div className={`${s.stepItem} ${step >= 2 ? s.stepDone : ""}`}>
            <div className={s.stepCircle}>2</div>
            <div>
              <div className={s.stepLabel}>Account details</div>
              <div className={s.stepHint}>Name, email and password</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.right}>
        <div className={s.card}>

          {/* Step 1 — Role selection */}
          {step === 1 && (
            <>
              <div className={s.cardTop}>
                <h2 className={s.cardTitle}>Select your role</h2>
                <p className={s.cardSub}>Your role controls what you can see and do inside WoodWise.</p>
              </div>

              <div className={s.roleGrid}>
                {ROLES.map(r => (
                  <button
                    key={r.key}
                    type="button"
                    className={`${s.roleCard} ${selectedRole === r.key ? s.roleCardActive : ""}`}
                    style={selectedRole === r.key ? { borderColor: r.color, background: r.bg } : {}}
                    onClick={() => { setSelectedRole(r.key); setError(""); }}
                  >
                    <div className={s.roleCardDot} style={{ background: r.color }} />
                    <div className={s.roleCardLabel} style={selectedRole === r.key ? { color: r.color } : {}}>
                      {r.label}
                    </div>
                    <div className={s.roleCardDesc}>{r.desc}</div>
                    {selectedRole === r.key && (
                      <div className={s.roleCardCheck} style={{ background: r.color }}>
                        <CheckIcon />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <p className={s.roleNote}><LockIcon />{ROLE_NOTE}</p>

              {error && <div className={s.errorBox}><AlertIcon />{error}</div>}

              <button className={s.btnSubmit} type="button" onClick={handleNext}>
                Continue
              </button>

              <p className={s.switchText}>
                Already have an account?{" "}
                <Link to="/login" className={s.switchLink}>Sign in</Link>
              </p>
            </>
          )}

          {/* Step 2 — Details */}
          {step === 2 && (
            <>
              <div className={s.cardTop}>
                <button type="button" className={s.backBtn} onClick={() => { setStep(1); setError(""); }}>
                  <BackIcon /> Back
                </button>
                <h2 className={s.cardTitle}>Account details</h2>
                <p className={s.cardSub}>
                  Signing up as{" "}
                  <span className={s.rolePill} style={{ background: roleObj?.bg, color: roleObj?.color }}>
                    {roleObj?.label}
                  </span>
                </p>
              </div>

              <form className={s.form} onSubmit={handleSubmit} noValidate>
                <div className={s.field}>
                  <label className={s.label}>Full name</label>
                  <input className={s.input} type="text" name="name" placeholder="Ravi Kumar" value={form.name} onChange={handleChange} autoComplete="name" />
                </div>

                <div className={s.field}>
                  <label className={s.label}>Email address</label>
                  <input className={s.input} type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} autoComplete="email" />
                </div>

                {selectedRole === "factory_admin" && (
                  <div className={s.field}>
                    <label className={s.label}>Factory name</label>
                    <input className={s.input} type="text" name="factoryName" placeholder="e.g. WoodWise Mumbai Unit 1" value={form.factoryName} onChange={handleChange} />
                  </div>
                )}

                <div className={s.fieldRow}>
                  <div className={s.field}>
                    <label className={s.label}>Password</label>
                    <div className={s.inputWrap}>
                      <input className={s.input} type={showPass ? "text" : "password"} name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} autoComplete="new-password" />
                      <button type="button" className={s.eyeBtn} onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                        {showPass ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Confirm password</label>
                    <div className={s.inputWrap}>
                      <input className={s.input} type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />
                      <button type="button" className={s.eyeBtn} onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && <div className={s.errorBox}><AlertIcon />{error}</div>}

                <button className={s.btnSubmit} type="submit" disabled={loading}>
                  {loading ? <span className={s.spinner} /> : "Create account"}
                </button>
              </form>

              <p className={s.switchText}>
                Already have an account?{" "}
                <Link to="/login" className={s.switchLink}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const SofaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="9" width="16" height="5" rx="1.5"/>
    <rect x="3" y="6" width="12" height="3" rx="1"/>
    <line x1="4" y1="14" x2="4" y2="17"/>
    <line x1="14" y1="14" x2="14" y2="17"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1.5,5 4,7.5 8.5,2"/>
  </svg>
);
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ flexShrink: 0 }}>
    <rect x="2" y="5" width="8" height="6" rx="1"/>
    <path d="M4 5V3.5a2 2 0 0 1 4 0V5"/>
  </svg>
);
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="11" y1="7" x2="3" y2="7"/>
    <polyline points="6,4 3,7 6,10"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/>
    <circle cx="8" cy="8" r="2"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 2l12 12M6.5 6.5A2 2 0 0 0 9.5 9.5"/>
    <path d="M4.5 4.5C2.8 5.6 1 8 1 8s2.5 5 7 5c1.3 0 2.5-.4 3.5-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.9 2.7"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="7" r="6"/>
    <line x1="7" y1="4" x2="7" y2="7.5"/>
    <circle cx="7" cy="10" r="0.6" fill="currentColor"/>
  </svg>
);