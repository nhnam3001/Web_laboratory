import { staticList, staticGet, staticSettings, readOnly } from "./staticData.js";

// The published build on GitHub Pages has no backend: it reads a static copy of
// the database instead, and the dashboard is not available there.
export const IS_STATIC = import.meta.env.VITE_STATIC_DATA === "true";

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

const staticApi = {
  login: readOnly,
  list: staticList,
  get: staticGet,
  create: readOnly,
  update: readOnly,
  remove: readOnly,
  getSettings: staticSettings,
  updateSettings: readOnly,
  uploadPhoto: readOnly,
};

export const api = IS_STATIC ? staticApi : liveApi;

export const ASSET_BASE_URL = BASE_URL.replace(/\/api\/?$/, "");

export function resolveAsset(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  // Static build: uploads are copied next to the app, under its base path.
  return IS_STATIC ? `${SITE_BASE.replace(/\/$/, "")}${url}` : `${ASSET_BASE_URL}${url}`;
}
