import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import s from "../ForgotPassword/ForgotPassword.module.css";

// ─── Constants & API ──────────────────────────────────────────────────────────
const BASE_URL = "https://factory-backend-hyio.onrender.com";

async function apiPost(path, body) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || "Something went wrong");
  return data;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const SofaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="9" width="16" height="5" rx="1.5" />
    <rect x="3" y="6" width="12" height="3" rx="1" />
    <line x1="4" y1="14" x2="4" y2="17" />
    <line x1="14" y1="14" x2="14" y2="17" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="7" r="6" />
    <line x1="7" y1="4" x2="7" y2="7.5" />
    <circle cx="7" cy="10" r="0.6" fill="currentColor" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 2l12 12M6.5 6.5A2 2 0 0 0 9.5 9.5" />
    <path d="M4.5 4.5C2.8 5.6 1 8 1 8s2.5 5 7 5c1.3 0 2.5-.4 3.5-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.9 2.7" />
  </svg>
);

const MailIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B6343" strokeWidth="1.6">
    <rect x="3" y="7" width="26" height="18" rx="3" />
    <path d="M3 10l13 9 13-9" />
  </svg>
);

const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2d7a3a" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="16" cy="16" r="13" />
    <polyline points="10 16 14 20 22 12" />
  </svg>
);

const ROLES = [
  { key: "system_admin",  label: "System Admin",  color: "#8B6343" },
  { key: "factory_admin", label: "Factory Admin", color: "#2d7a3a" },
  { key: "manager",       label: "Manager",       color: "#1a5fa8" },
  { key: "accountant",    label: "Accountant",    color: "#b07d1a" },
  { key: "clerk",         label: "Clerk",         color: "#7a3a8a" },
];

// ─── Step 1 — Email ───────────────────────────────────────────────────────────
function StepEmail({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    setError("");
    try {
      await apiPost("/auth/forgot-password", { email: email.trim() });
      onSuccess(email.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={s.cardTop}>
        <div className={s.iconWrap}><MailIcon /></div>
        <h2 className={s.cardTitle}>Forgot password?</h2>
        <p className={s.cardSub}>Enter the email linked to your account and we'll send you a reset code.</p>
      </div>

      <form className={s.form} onSubmit={submit} noValidate>
        <div className={s.field}>
          <label className={s.label}>Email address</label>
          <input
            className={s.input}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            autoComplete="email"
            autoFocus
          />
        </div>

        {error && <div className={s.errorBox}><AlertIcon />{error}</div>}

        <button className={s.btnSubmit} type="submit" disabled={loading}>
          {loading ? <span className={s.spinner} /> : "Send reset code"}
        </button>
      </form>

      <p className={s.switchText}>
        Remember your password?{" "}
        <Link to="/login" className={s.switchLink}>Back to log in</Link>
      </p>
    </>
  );
}

// ─── Step 2 — OTP ─────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;

function StepOTP({ email, onSuccess, onResend }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  const inputs = useRef(Array.from({ length: OTP_LENGTH }, () => React.createRef()));

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError("");
    if (val && i < OTP_LENGTH - 1) inputs.current[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1].current?.focus();
    if (e.key === "ArrowLeft"  && i > 0) inputs.current[i - 1].current?.focus();
    if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) inputs.current[i + 1].current?.focus();
  };

  const handlePaste = e => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    text.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    const focusIdx = Math.min(text.length, OTP_LENGTH - 1);
    inputs.current[focusIdx].current?.focus();
  };

  const submit = async e => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true);
    setError("");
    try {
      // Step 2 Endpoint: POST /auth/verify-otp
      const data = await apiPost("/auth/verify-otp", { email, otp: code });
      // Capture reset_token from response
      onSuccess(data.reset_token);
    } catch (err) {
      setError(err.message);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputs.current[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    try {
      await onResend();
      setResent(true);
      setCountdown(30);
      setTimeout(() => setResent(false), 3000);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className={s.cardTop}>
        <div className={s.iconWrap}><MailIcon /></div>
        <h2 className={s.cardTitle}>Check your email</h2>
        <p className={s.cardSub}>
          We sent a 6-digit code to <strong className={s.emailHighlight}>{email}</strong>.
          It expires in 10 minutes.
        </p>
      </div>

      <form className={s.form} onSubmit={submit} noValidate>
        <div className={s.field}>
          <label className={s.label}>Verification code</label>
          <div className={s.otpRow} onPaste={handlePaste}>
            {otp.map((val, i) => (
              <input
                key={i}
                ref={inputs.current[i]}
                className={`${s.otpBox} ${error ? s.otpBoxError : ""}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>
        </div>

        {error && <div className={s.errorBox}><AlertIcon />{error}</div>}
        {resent && <div className={s.successBox}>Code resent successfully!</div>}

        <button className={s.btnSubmit} type="submit" disabled={loading}>
          {loading ? <span className={s.spinner} /> : "Verify code"}
        </button>
      </form>

      <div className={s.switchText}>
        Didn't receive it?{" "}
        {countdown > 0
          ? <span className={s.countdownText}>Resend in {countdown}s</span>
          : <button type="button" className={s.resendBtn} onClick={handleResend} disabled={resending}>
              {resending ? "Resending…" : "Resend code"}
            </button>
        }
      </div>

      <p className={s.switchText} style={{ marginTop: 4 }}>
        <Link to="/login" className={s.switchLink}>← Back to log in</Link>
      </p>
    </>
  );
}

// ─── Step 3 — New Password ────────────────────────────────────────────────────
function StepNewPassword({ resetToken, onSuccess }) {
  const [form, setForm]       = useState({ password: "", confirm: "" });
  const [show, setShow]       = useState({ password: false, confirm: false });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)           score++;
    if (/[A-Z]/.test(p))         score++;
    if (/[0-9]/.test(p))         score++;
    if (/[^A-Za-z0-9]/.test(p))  score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#c0392b", "#b07d1a", "#1a5fa8", "#2d7a3a"][strength];

  const submit = async e => {
    e.preventDefault();
    if (!form.password) { setError("Please enter a new password."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    
    setLoading(true);
    setError("");
    try {
      // Step 3 Endpoint: POST /auth/reset-password
      await apiPost("/auth/reset-password", { 
        reset_token: resetToken, 
        new_password: form.password 
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={s.cardTop}>
        <h2 className={s.cardTitle}>Set new password</h2>
        <p className={s.cardSub}>Choose a strong password for your WoodWise account.</p>
      </div>

      <form className={s.form} onSubmit={submit} noValidate>
        <div className={s.field}>
          <label className={s.label}>New password</label>
          <div className={s.inputWrap}>
            <input
              className={s.input}
              type={show.password ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(""); }}
              autoFocus
            />
            <button type="button" className={s.eyeBtn} onClick={() => setShow(v => ({ ...v, password: !v.password }))} tabIndex={-1}>
              {show.password ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {form.password && (
            <div className={s.strengthWrap}>
              <div className={s.strengthBar}>
                {[1,2,3,4].map(n => (
                  <div key={n} className={s.strengthSegment}
                    style={{ background: n <= strength ? strengthColor : "#e0d8ce" }} />
                ))}
              </div>
              <span className={s.strengthLabel} style={{ color: strengthColor }}>{strengthLabel}</span>
            </div>
          )}
        </div>

        <div className={s.field}>
          <label className={s.label}>Confirm password</label>
          <div className={s.inputWrap}>
            <input
              className={s.input}
              type={show.confirm ? "text" : "password"}
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setError(""); }}
            />
            <button type="button" className={s.eyeBtn} onClick={() => setShow(v => ({ ...v, confirm: !v.confirm }))} tabIndex={-1}>
              {show.confirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {error && <div className={s.errorBox}><AlertIcon />{error}</div>}

        <button className={s.btnSubmit} type="submit" disabled={loading}>
          {loading ? <span className={s.spinner} /> : "Reset password"}
        </button>
      </form>
    </>
  );
}

// ─── Step 4 — Success ─────────────────────────────────────────────────────────
function StepSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={s.successWrap}>
      <div className={s.successIcon}><CheckIcon /></div>
      <h2 className={s.cardTitle}>Password reset!</h2>
      <p className={s.cardSub}>Your password has been updated successfully. You can now log in with your new password.</p>
      <button className={s.btnSubmit} style={{ marginTop: 24 }} onClick={() => navigate("/login")}>
        Back to log in
      </button>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ForgotPass() {
  const [step, setStep]   = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const resendOtp = async () => {
    await apiPost("/auth/forgot-password", { email });
  };

  return (
    <div className={s.page}>
      <div className={s.left}>
        <div className={s.brand}>
          <div className={s.brandMark}><SofaIcon /></div>
          <span className={s.brandName}>WoodWise</span>
        </div>

        <div className={s.tagline}>
          <h1 className={s.taglineHead}>Secure<br />by design.</h1>
          <p className={s.taglineSub}>
            Your factory data stays safe. Reset your password and get back to managing your floor.
          </p>
        </div>

        <div className={s.leftSteps}>
          {[
            { n: 1, label: "Verify email" },
            { n: 2, label: "Enter code"   },
            { n: 3, label: "New password" },
          ].map(({ n, label }) => (
            <div key={n} className={s.leftStep}>
              <div className={`${s.leftStepDot} ${step >= n ? s.leftStepDotActive : ""} ${step > n ? s.leftStepDotDone : ""}`}>
                {step > n
                  ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><polyline points="2 5 4 7 8 3" /></svg>
                  : n
                }
              </div>
              <span className={`${s.leftStepLabel} ${step >= n ? s.leftStepLabelActive : ""}`}>{label}</span>
              {n < 3 && <div className={`${s.leftStepLine} ${step > n ? s.leftStepLineDone : ""}`} />}
            </div>
          ))}
        </div>

        <div className={s.roleGrid}>
          {ROLES.map(r => (
            <div key={r.key} className={s.roleChip}>
              <span className={s.roleChipDot} style={{ background: r.color }} />
              {r.label}
            </div>
          ))}
        </div>
      </div>

      <div className={s.right}>
        <div className={s.card}>
          {step === 1 && (
            <StepEmail onSuccess={e => { setEmail(e); setStep(2); }} />
          )}
          {step === 2 && (
            <StepOTP 
              email={email} 
              onSuccess={token => { setResetToken(token); setStep(3); }} 
              onResend={resendOtp} 
            />
          )}
          {step === 3 && (
            <StepNewPassword 
              resetToken={resetToken} 
              onSuccess={() => setStep(4)} 
            />
          )}
          {step === 4 && <StepSuccess />}
        </div>
      </div>
    </div>
  );
}