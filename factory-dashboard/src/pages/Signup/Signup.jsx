import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import s from "./Signup.module.css";
import { signup } from "../../api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:            "",
    email:           "",
    companyName:     "",
    password:        "",
    confirmPassword: "",
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.name || !form.email || !form.companyName || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
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
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>

      {/* ── Left panel ── */}
      <div className={s.left}>
        <div className={s.brand}>
          <div className={s.brandMark}><SofaIcon /></div>
          <span className={s.brandName}>WoodWise</span>
        </div>

        <div className={s.tagline}>
          <h1 className={s.taglineHead}>Your factory,<br />your dashboard.</h1>
          <p className={s.taglineSub}>
            Set up your account in under 2 minutes and get full visibility
            into your inventory.
          </p>
        </div>

        {/* keeps tagline vertically centred */}
        <div />
      </div>

      {/* ── Right panel ── */}
      <div className={s.right}>
        <div className={s.card}>

          <div className={s.cardTop}>
            <h2 className={s.cardTitle}>Create your account</h2>
            <p className={s.cardSub}>Get started with WoodWise — it's free.</p>
          </div>

          <form className={s.form} onSubmit={handleSubmit} noValidate>

            {/* Full name */}
            <div className={s.field}>
              <label className={s.label}>Full name</label>
              <input
                className={s.input}
                type="text"
                name="name"
                placeholder="Ravi Kumar"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className={s.field}>
              <label className={s.label}>Email address</label>
              <input
                className={s.input}
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {/* Company name */}
            <div className={s.field}>
              <label className={s.label}>Company name</label>
              <input
                className={s.input}
                type="text"
                name="companyName"
                placeholder="e.g. WoodWise Mumbai Unit 1"
                value={form.companyName}
                onChange={handleChange}
                autoComplete="organization"
              />
            </div>

            {/* Password + Confirm — side by side */}
            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>Password</label>
                <div className={s.inputWrap}>
                  <input
                    className={s.input}
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={s.eyeBtn}
                    onClick={() => setShowPass(v => !v)}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Confirm password</label>
                <div className={s.inputWrap}>
                  <input
                    className={s.input}
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={s.eyeBtn}
                    onClick={() => setShowConfirm(v => !v)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className={s.errorBox}>
                <AlertIcon />
                {error}
              </div>
            )}

            <button className={s.btnSubmit} type="submit" disabled={loading}>
              {loading ? <span className={s.spinner} /> : "Create account"}
            </button>

          </form>

          <p className={s.switchText}>
            Already have an account?{" "}
            <Link to="/" className={s.switchLink}>Log in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

/* ── Icons ── */

const SofaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="9" width="16" height="5" rx="1.5"/>
    <rect x="3" y="6" width="12" height="3" rx="1"/>
    <line x1="4" y1="14" x2="4" y2="17"/>
    <line x1="14" y1="14" x2="14" y2="17"/>
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