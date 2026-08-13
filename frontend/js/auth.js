// auth.js — JWT login/session handling and frontend route protection.

function getSession() {
  try { return JSON.parse(localStorage.getItem(DB_KEYS.SESSION)); }
  catch { return null; }
}

async function login(username, password) {
  try {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    setSession(result);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function logout() {
  try {
    if (getToken()) await apiRequest("/auth/logout", { method: "POST" });
  } catch (_) {
    // Even if the server request fails, remove the local session.
  }
  clearSession();
  window.location.href = "login.html";
}

function requireAuth() {
  if (!getSession() || !getToken()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function renderSessionInfo(elementId) {
  const session = getSession();
  const el = document.getElementById(elementId);
  if (el && session) {
    const name = session.fullName || session.username || "Admin";
    el.textContent = name;
  }
}
