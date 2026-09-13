import {
  demoList,
  demoGet,
  demoCreate,
  demoUpdate,
  demoRemove,
  demoSettings,
  demoUpdateSettings,
  demoLogin,
  demoUpload,
} from "./demoStore.js";

// The published build on GitHub Pages has no backend. It runs as a demo: each
// visitor gets their own editable copy of the data in their browser.
export const IS_DEMO = import.meta.env.VITE_STATIC_DATA === "true";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const SITE_BASE = import.meta.env.BASE_URL;

async function request(path, { method = "GET", body, token, isForm } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

function queryString(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v);
  return entries.length ? `?${new URLSearchParams(Object.fromEntries(entries))}` : "";
}

const liveApi = {
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: { username, password } }),

  list: (collection, params) => request(`/${collection}${queryString(params)}`),
  get: (collection, id) => request(`/${collection}/${id}`),
  create: (collection, data, token) =>
    request(`/${collection}`, { method: "POST", body: data, token }),
  update: (collection, id, data, token) =>
    request(`/${collection}/${id}`, { method: "PUT", body: data, token }),
  remove: (collection, id, token) =>
    request(`/${collection}/${id}`, { method: "DELETE", token }),

  getSettings: () => request("/settings"),
  updateSettings: (data, token) =>
    request("/settings", { method: "PUT", body: data, token }),

  uploadPhoto: (file, token) => {
    const form = new FormData();
    form.append("photo", file);
    return request("/upload", { method: "POST", body: form, token, isForm: true });
  },
};

const demoApi = {
  login: demoLogin,
  list: demoList,
  get: demoGet,
  create: (collection, data) => demoCreate(collection, data),
  update: (collection, id, data) => demoUpdate(collection, id, data),
  remove: (collection, id) => demoRemove(collection, id),
  getSettings: demoSettings,
  updateSettings: (data) => demoUpdateSettings(data),
  uploadPhoto: (file) => demoUpload(file),
};

export const api = IS_DEMO ? demoApi : liveApi;

export const ASSET_BASE_URL = BASE_URL.replace(/\/api\/?$/, "");

export function resolveAsset(url) {
  if (!url) return null;
  // Images added during a demo session are inlined as data URLs.
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  // Demo build: seeded uploads are copied next to the app, under its base path.
  return IS_DEMO ? `${SITE_BASE.replace(/\/$/, "")}${url}` : `${ASSET_BASE_URL}${url}`;
}
