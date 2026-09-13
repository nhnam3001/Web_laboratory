// Data layer for the published demo build. There is no backend, so the database
// is seeded from a static JSON file into the visitor's own browser storage.
// Every visitor gets a private, fully editable copy: their edits are never seen
// by anyone else and never touch the real site.

const STORAGE_KEY = "lab_demo_db";
const SEED_URL = `${import.meta.env.BASE_URL}data/db.json`;

export const DEMO_CREDENTIALS = { username: "admin", password: "demo123" };

const ID_PREFIX = {
  members: "mem",
  news: "news",
  research: "res",
  funding: "fund",
  publications: "pub",
};

let dbPromise = null;

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    throw new Error(
      "Your browser's storage for this demo is full. Try a smaller image, or reset the demo data."
    );
  }
}

function loadDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const stored = readStored();
      if (stored) return stored;

      const res = await fetch(SEED_URL);
      if (!res.ok) throw new Error(`Could not load demo data (${res.status})`);
      const seed = await res.json();
      try {
        persist(seed);
      } catch {
        // Storage unavailable (private mode): fall back to an in-memory copy.
      }
      return seed;
    })();
  }
  return dbPromise;
}

async function mutate(fn) {
  const db = await loadDb();
  const result = fn(db);
  persist(db);
  return result;
}

// Mirrors the ordering the real API applies, so both modes render identically.
function sortItems(collection, items) {
  if (collection === "news") {
    return [...items].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  }
  if (collection === "publications") {
    return [...items].sort(
      (a, b) =>
        (b.year ?? "").localeCompare(a.year ?? "") || (a.order ?? 0) - (b.order ?? 0)
    );
  }
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function demoList(collection, params = {}) {
  const db = await loadDb();
  const items = (db[collection] ?? []).filter((item) =>
    Object.entries(params).every(([key, value]) => !value || item[key] === value)
  );
  return sortItems(collection, items);
}

export async function demoGet(collection, id) {
  const db = await loadDb();
  const item = (db[collection] ?? []).find((i) => i.id === id);
  if (!item) throw new Error("Item not found");
  return item;
}

export function demoCreate(collection, data) {
  return mutate((db) => {
    const list = db[collection] ?? (db[collection] = []);
    const item = {
      order: list.length + 1,
      ...data,
      id: `${ID_PREFIX[collection] ?? "item"}-${Date.now().toString(36)}`,
    };
    list.push(item);
    return item;
  });
}

export function demoUpdate(collection, id, data) {
  return mutate((db) => {
    const list = db[collection] ?? [];
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Item not found");
    list[idx] = { ...list[idx], ...data, id };
    return list[idx];
  });
}

export function demoRemove(collection, id) {
  return mutate((db) => {
    const list = db[collection] ?? [];
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Item not found");
    list.splice(idx, 1);
    return null;
  });
}

export async function demoSettings() {
  return (await loadDb()).settings ?? {};
}

export function demoUpdateSettings(data) {
  return mutate((db) => {
    db.settings = { ...db.settings, ...data };
    return db.settings;
  });
}

export function demoLogin(username, password) {
  if (
    username === DEMO_CREDENTIALS.username &&
    password === DEMO_CREDENTIALS.password
  ) {
    return Promise.resolve({ token: "demo-session" });
  }
  return Promise.reject(new Error("Invalid username or password"));
}

// No server to upload to: shrink the image and keep it inline as a data URL,
// small enough to fit in browser storage.
export function demoUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a readable image"));
      img.onload = () => {
        const MAX = 900;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ url: canvas.toDataURL("image/jpeg", 0.72) });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function resetDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
  dbPromise = null;
}
