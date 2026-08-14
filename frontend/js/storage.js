// storage.js — Frontend API layer. All library data is stored in the backend
// database; the browser only keeps the JWT session token.

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://webapplication-backend.onrender.com/api";
const DB_KEYS = { SESSION: "lms_session" };

function getToken() {
  return localStorage.getItem("lms_token");
}

function setSession(data) {
  localStorage.setItem("lms_token", data.token);
  localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({
    id: data.id,
    username: data.username,
    fullName: data.fullName,
    loggedInAt: Date.now()
  }));
}

function clearSession() {
  localStorage.removeItem("lms_token");
  localStorage.removeItem(DB_KEYS.SESSION);
}

async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (response.status === 401) {
    clearSession();
    if (!window.location.pathname.endsWith("/login.html")) {
      window.location.href = "login.html";
    }
    throw new Error(data?.error || "Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    const message = data?.error || data?.errors?.map(e => e.msg).join(" ") || "Request failed.";
    throw new Error(message);
  }

  return data;
}

function showErrors(errors, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = Array.isArray(errors) ? errors : [errors];
  const messages = list.filter(Boolean).map(e =>
    typeof e === "string" ? e : (e.message || e.msg || "Request failed.")
  );

  if (messages.length === 0) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  container.style.display = "block";
  container.innerHTML = "<ul>" + messages.map(m => `<li>${m}</li>`).join("") + "</ul>";
}

const BookStore = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.title) params.set("title", filters.title);
    if (filters.genreId) params.set("genreId", filters.genreId);
    const query = params.toString() ? `?${params}` : "";
    return apiRequest(`/books${query}`);
  },
  getById: (id) => apiRequest(`/books/${Number(id)}`),
  add: async (book) => {
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("authorId", book.authorId);
    formData.append("genreId", book.genreId);
    formData.append("stock", book.stock);
    if (book.coverFile) formData.append("cover", book.coverFile);
    return apiRequest("/books", { method: "POST", body: formData });
  },
  update: async (id, book) => {
    const formData = new FormData();
    if (book.title !== undefined) formData.append("title", book.title);
    if (book.authorId !== undefined) formData.append("authorId", book.authorId);
    if (book.genreId !== undefined) formData.append("genreId", book.genreId);
    if (book.stock !== undefined) formData.append("stock", book.stock);
    if (book.coverFile) formData.append("cover", book.coverFile);
    return apiRequest(`/books/${Number(id)}`, { method: "PUT", body: formData });
  },
  remove: (id) => apiRequest(`/books/${Number(id)}`, { method: "DELETE" })
};

const AuthorStore = {
  getAll: () => apiRequest("/authors"),
  getById: (id) => apiRequest(`/authors/${Number(id)}`),
  add: (author) => apiRequest("/authors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(author)
  }),
  update: (id, author) => apiRequest(`/authors/${Number(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(author)
  }),
  remove: (id) => apiRequest(`/authors/${Number(id)}`, { method: "DELETE" })
};

const GenreStore = {
  getAll: () => apiRequest("/genres"),
  getById: (id) => apiRequest(`/genres/${Number(id)}`),
  add: (genre) => apiRequest("/genres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(genre)
  }),
  update: (id, genre) => apiRequest(`/genres/${Number(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(genre)
  }),
  remove: (id) => apiRequest(`/genres/${Number(id)}`, { method: "DELETE" })
};
