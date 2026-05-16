const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export function getToken() {
  if (typeof document === "undefined") return null;
  const rawToken =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] ?? null;

  return rawToken ? decodeURIComponent(rawToken) : null;
}

function authHeaders() {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated. Please log in again.");
  }
  return { Authorization: `Bearer ${token}` };
}

async function readErrorMessage(res, fallback) {
  try {
    const body = await res.json();
    if (body && typeof body === "object") {
      return body.message || body.error || fallback;
    }
  } catch {
    /* non-JSON body */
  }
  return fallback;
}

async function requireOk(res, fallback) {
  if (res.ok) return;

  if (res.status === 401) {
    clearToken();
  }

  const msg = await readErrorMessage(res, fallback);
  throw new Error(msg);
}

export async function registerUser(name, email, password) {
  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  await requireOk(res, "Registration failed");
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  await requireOk(res, "Login failed");
  return res.json();
}

export async function getExpenses() {
  const res = await fetch(apiUrl("/api/expenses"), {
    headers: authHeaders(),
  });
  await requireOk(res, "Failed to fetch expenses");
  return res.json();
}

export async function createExpense(data) {
  const res = await fetch(apiUrl("/api/expenses"), {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await requireOk(res, "Failed to create expense");
  return res.json();
}

export async function updateExpense(id, data) {
  const res = await fetch(apiUrl(`/api/expenses/${id}`), {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await requireOk(res, "Failed to update expense");
  return res.json();
}


export async function deleteExpense(id) {
  const res = await fetch(apiUrl(`/api/expenses/${id}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  await requireOk(res, "Failed to delete expense");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(apiUrl("/api/categories"), {
    headers: authHeaders(),
  });
  await requireOk(res, "Failed to fetch categories");
  return res.json();
}

export async function getBudgets() {
  const res = await fetch(apiUrl("/api/budgets"), {
    headers: authHeaders(),
  });
  await requireOk(res, "Failed to fetch budgets");
  return res.json();
}

export async function saveBudget(data) {
  const res = await fetch(apiUrl("/api/budgets"), {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await requireOk(res, "Failed to save budget");
  return res.json();
}

export async function deleteBudget(id) {
  const res = await fetch(apiUrl(`/api/budgets/${id}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  await requireOk(res, "Failed to delete budget");
  return res.json();
}

export async function updateBudget(id, data) {
  const res = await fetch(apiUrl(`/api/budgets/${id}`), {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await requireOk(res, "Failed to update budget");
  return res.json();
}

export async function getProfile() {
  const res = await fetch(apiUrl("/api/profile"), {
    headers: authHeaders(),
  });
  await requireOk(res, "Failed to fetch profile");
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(apiUrl("/api/profile"), {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await requireOk(res, "Failed to update profile");
  return res.json();
}

export function saveToken(token) {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${
    7 * 24 * 60 * 60
  }; SameSite=Lax`;
  try {
    localStorage.setItem("token", token);
  } catch {
    /* ignore localStorage failures */
  }
}

export function clearToken() {
  document.cookie = "token=; path=/; max-age=0";
  try {
    localStorage.removeItem("token");
  } catch {
    /* ignore localStorage failures */
  }
}
