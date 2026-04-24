import axios from "axios";

// ── Base instance ──────────────────────────────────────────────
const api = axios.create({
  baseURL: "https://factory-backend-hyio.onrender.com",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor — attach JWT on every request ──────────
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ── Response interceptor — handle 401 globally ─────────────────
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Session helpers ────────────────────────────────────────────
export const getToken   = () => localStorage.getItem("token");
export const getUser    = () => JSON.parse(localStorage.getItem("user") || "null");
export const isLoggedIn = () => !!getToken();

const saveSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ── Auth — Login ───────────────────────────────────────────────
// POST /auth/login
// Body:     { email, password }
// Response: { access_token, token_type }
// Note: role is decoded from the JWT payload (sub, tenant_id, role, exp)
export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  const { access_token } = res.data;

  // Save token first
  localStorage.setItem("token", access_token);

  // Now fetch the actual user object from /auth/me
  const userRes = await api.get("/auth/me");
  const user = userRes.data;

  // Save user to localStorage
  localStorage.setItem("user", JSON.stringify(user));

  return { token: access_token, user };
};

// ── Auth — Company Signup ──────────────────────────────────────
// POST /auth/signup  (creates a new company + factory_admin account)
// Body:     { email, password, full_name, company_name }
// Response: { id, email, full_name, tenant_id, role }
export const signup = async ({ email, password, fullName, companyName }) => {
  const res = await api.post("/auth/signup", {
    email,
    password,
    full_name:    fullName,
    company_name: companyName,
  });
  return res.data;
};

// ── Auth — Create Employee ─────────────────────────────────────
// POST /auth/employees  (factory_admin creates staff under their tenant)
// Body:     { email, password, full_name, role }
// Response: { id, email, full_name, tenant_id, role }
export const createEmployee = async ({ email, password, fullName, role }) => {
  const res = await api.post("/auth/employees", {
    email,
    password,
    full_name: fullName,
    role,
  });
  return res.data;
};

// ── Auth — Logout ──────────────────────────────────────────────
export const logout = () => {
  clearSession();
  window.location.href = "/login";
};

// ── Auth — Get current user ────────────────────────────────────
// GET /auth/me
// Response: { id, email, full_name, tenant_id, role }
export const getMe = async () => {
  const res = await api.get("/auth/me");
  const user = res.data;
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

// ── Role constants ─────────────────────────────────────────────
export const ROLES = {
  SYSTEM_ADMIN:  "system_admin",
  FACTORY_ADMIN: "factory_admin",
  MANAGER:       "manager",
  ACCOUNTANT:    "accountant",
  CLERK:         "clerk",
};

// Role hierarchy — higher index = more access
const ROLE_HIERARCHY = [
  ROLES.CLERK,
  ROLES.ACCOUNTANT,
  ROLES.MANAGER,
  ROLES.FACTORY_ADMIN,
  ROLES.SYSTEM_ADMIN,
];

export const hasRole = (user, requiredRole) => {
  if (!user) return false;
  return ROLE_HIERARCHY.indexOf(user.role) >= ROLE_HIERARCHY.indexOf(requiredRole);
};



export function getRoleHomePage(role) {
  switch (role) {
    case ROLES.SYSTEM_ADMIN:  return "/system-admin";
    case ROLES.FACTORY_ADMIN: return "/factory-admin";
    case ROLES.MANAGER:       return "/manager";
    case ROLES.ACCOUNTANT:    return "/accountant";
    case ROLES.CLERK:         return "/clerk";
    default:                  return "/";
  }
}

export default api;