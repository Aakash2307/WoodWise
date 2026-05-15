const BASE_URL = "https://factory-backend-hyio.onrender.com";

// ─── Role Constants ─────────────────────────────────────────────
export const ROLES = {
  SYSTEM_ADMIN:  "system_admin",
  FACTORY_ADMIN: "factory_admin",
  MANAGER:       "manager",
  ACCOUNTANT:    "accountant",
  CLERK:         "clerk",
};

const ROLE_HIERARCHY = [
  ROLES.CLERK,
  ROLES.ACCOUNTANT,
  ROLES.MANAGER,
  ROLES.FACTORY_ADMIN,
  ROLES.SYSTEM_ADMIN,
];

// ─── Session Helpers & Interceptor Logic ─────────────────────────
export const getToken   = () => localStorage.getItem("token") || "";
export const getUser    = () => JSON.parse(localStorage.getItem("user") || "null");
export const isLoggedIn = () => !!getToken();

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Global request wrapper (handles errors, 204s, and global 401 redirects)
async function request(method, path, body = null) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: authHeaders(),
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  });

  // Handle global 401 Unauthorized
  if (res.status === 401) {
    clearSession();
    window.location.href = "/login";
    return null;
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || "Something went wrong");
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

// POST /auth/login -> followed by automatic profile fetch
export async function login({ email, password }) {
  const data = await request("POST", "/auth/login", { email, password });
  
  // Accept either variant key naming safely
  const token = data?.access_token || data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  // Fetch the actual user object immediately to sync session storage
  const user = await getMe();
  
  return { token, user };
}

// POST /auth/signup (creates a new company + factory_admin account)
export async function signup({ email, password, fullName, companyName }) {
  const data = await request("POST", "/auth/signup", {
    email,
    password,
    full_name:    fullName,
    company_name: companyName,
  });
  return data;
}

// POST /auth/employees (factory_admin creates staff under their tenant)
export async function createEmployee({ email, password, fullName, role }) {
  return request("POST", "/auth/employees", {
    email,
    password,
    full_name: fullName,
    role,
  });
}

export function logout() {
  clearSession();
  window.location.href = "/login";
}

// GET /auth/me
export async function getMe() {
  const user = await request("GET", "/auth/me");
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(email) {
  return request("POST", "/auth/forgot-password", { email });
}

export async function verifyOtp(email, otp) {
  return request("POST", "/auth/verify-otp", { email, otp });
}

export async function resetPassword(email, otp, new_password) {
  return request("POST", "/auth/reset-password", { email, otp, new_password });
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

// PUT /company/onboarding/step-1-profile
export async function onboardingStep1({ gstin, pan_number }) {
  return request("PUT", "/company/onboarding/step-1-profile", { gstin, pan_number });
}

// POST /company/onboarding/step-2-locations
export async function onboardingStep2({ name, location_type, address }) {
  return request("POST", "/company/onboarding/step-2-locations", { name, location_type, address });
}

// POST /company/onboarding/step-3-seed
export async function onboardingStep3() {
  return request("POST", "/company/onboarding/step-3-seed");
}

// ─── Inventory — Categories ───────────────────────────────────────────────────

export async function getCategories() {
  return request("GET", "/inventory/categories");
}

export async function createCategory(name) {
  return request("POST", "/inventory/categories", { name });
}

export async function updateCategory(category_id, name) {
  return request("PUT", `/inventory/categories/${category_id}`, { name });
}

export async function deleteCategory(category_id) {
  return request("DELETE", `/inventory/categories/${category_id}`);
}

// ─── Role Utilities ───────────────────────────────────────────────────────────

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

// Add this to the VERY bottom of api.js to satisfy Vite's cache
export default {};