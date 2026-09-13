// Data source for the published static build: the whole database is shipped as
// one JSON file next to the app, so the site works with no backend running.

const DB_URL = `${import.meta.env.BASE_URL}data/db.json`;

let dbPromise = null;

function loadDb() {
  if (!dbPromise) {
    dbPromise = fetch(DB_URL).then((res) => {
      if (!res.ok) throw new Error(`Could not load site data (${res.status})`);
      return res.json();
    });
  }
  return dbPromise;
}

// Mirrors the ordering the API applies, so both modes render the same way.
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

export async function staticList(collection, params = {}) {
  const db = await loadDb();
  const items = (db[collection] ?? []).filter((item) =>
    Object.entries(params).every(([key, value]) => !value || item[key] === value)
  );
  return sortItems(collection, items);
}

export async function staticGet(collection, id) {
  const db = await loadDb();
  const item = (db[collection] ?? []).find((i) => i.id === id);
  if (!item) throw new Error("Item not found");
  return item;
}

export async function staticSettings() {
  return (await loadDb()).settings ?? {};
}

export function readOnly() {
  return Promise.reject(
    new Error("This is a published copy of the site. Edit content in the local dashboard.")
  );
}
