const BASE_URL = "https://factory-backend-hyio.onrender.com";

// ─── Role Constants ───────────────────────────────────────────────────────────
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

// ─── Session Helpers ──────────────────────────────────────────────────────────
export const getToken   = () => localStorage.getItem("ww_token") || "";
export const getUser    = () => JSON.parse(localStorage.getItem("ww_user") || "null");
export const isLoggedIn = () => !!getToken();

export const clearSession = () => {
  localStorage.removeItem("ww_token");
  localStorage.removeItem("ww_user");
};

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Global Request Wrapper ───────────────────────────────────────────────────
async function request(method, path, body = null) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: authHeaders(),
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    clearSession();
    window.location.href = "/login";
    return null;
  }

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || "Something went wrong");
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login({ email, password }) {
  const data = await request("POST", "/auth/login", { email, password });
  const token = data?.access_token || data?.token;
  if (token) {
    localStorage.setItem("ww_token", token);
  }
  const user = await getMe();
  return { token, user };
}

export async function signup({ email, password, fullName, companyName }) {
  return request("POST", "/auth/signup", {
    email,
    password,
    full_name:    fullName,
    company_name: companyName,
  });
}

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

export async function getMe() {
  const user = await request("GET", "/auth/me");
  if (user) {
    localStorage.setItem("ww_user", JSON.stringify(user));
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

export async function onboardingStep1({ gstin, pan_number }) {
  return request("PUT", "/company/onboarding/step-1-profile", { gstin, pan_number });
}

export async function onboardingStep2({ name, location_type, address }) {
  return request("POST", "/company/onboarding/step-2-locations", { name, location_type, address });
}

export async function onboardingStep3() {
  return request("POST", "/company/onboarding/step-3-seed");
}

// ─── Inventory — Categories ───────────────────────────────────────────────────

// GET /inventory/categories
export async function getCategories() {
  return request("GET", "/inventory/categories");
}

// POST /inventory/categories  — body: { name: "string" }
export async function createCategory({ name }) {
  return request("POST", "/inventory/categories", { name });
}

// PUT /inventory/categories/{id}  — body: { name: "string" }
export async function updateCategory(category_id, { name }) {
  return request("PUT", `/inventory/categories/${category_id}`, { name });
}

// DELETE /inventory/categories/{id}
export async function deleteCategory(category_id) {
  return request("DELETE", `/inventory/categories/${category_id}`);
}

// ─── Inventory — Items ────────────────────────────────────────────────────────

// GET /inventory/items?category_id=X
export async function getItems({ category_id } = {}) {
  const params = category_id ? `?category_id=${category_id}` : "";
  return request("GET", `/inventory/items${params}`);
}

// POST /inventory/items
// body: { name, sku, item_type, category_id, unit_of_measure, purchase_uom, conversion_ratio, reorder_level }
export async function createItem(body) {
  return request("POST", "/inventory/items", body);
}

// DELETE /inventory/items/{item_id}
export async function deleteItem(item_id) {
  return request("DELETE", `/inventory/items/${item_id}`);
}

// ─── Inventory — Movements ────────────────────────────────────────────────────

// POST /inventory/movements
// body: { item_id, location_id, quantity, transaction_type, reference_number, remarks }
export async function recordMovement(body) {
  return request("POST", "/inventory/movements", body);
}

// ─── Inventory — Transactions ─────────────────────────────────────────────────

// GET /inventory/transactions?item_id=X&transaction_type=inward|outward
export async function getTransactions({ item_id, transaction_type } = {}) {
  const params = new URLSearchParams();
  if (item_id)          params.set("item_id", item_id);
  if (transaction_type) params.set("transaction_type", transaction_type);
  return request("GET", `/inventory/transactions?${params}`);
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

export default {};