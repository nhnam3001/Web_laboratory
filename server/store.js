import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "db.json");

export const COLLECTIONS = ["members", "news", "research", "funding", "publications"];

const ID_PREFIX = {
  members: "mem",
  news: "news",
  research: "res",
  funding: "fund",
  publications: "pub",
};

let writeQueue = Promise.resolve();

async function readDb() {
  return JSON.parse(await readFile(DB_PATH, "utf-8"));
}

function writeDb(db) {
  writeQueue = writeQueue.then(() =>
    writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8")
  );
  return writeQueue;
}

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

export async function list(collection, filters = {}) {
  const db = await readDb();
  const items = (db[collection] ?? []).filter((item) =>
    Object.entries(filters).every(([key, value]) => item[key] === value)
  );
  return sortItems(collection, items);
}

export async function get(collection, id) {
  const db = await readDb();
  return (db[collection] ?? []).find((item) => item.id === id) ?? null;
}

export async function create(collection, data) {
  const db = await readDb();
  const id = `${ID_PREFIX[collection]}-${Date.now().toString(36)}`;
  const item = { order: (db[collection]?.length ?? 0) + 1, ...data, id };
  db[collection] = [...(db[collection] ?? []), item];
  await writeDb(db);
  return item;
}

export async function update(collection, id, data) {
  const db = await readDb();
  const idx = (db[collection] ?? []).findIndex((item) => item.id === id);
  if (idx === -1) return null;
  db[collection][idx] = { ...db[collection][idx], ...data, id };
  await writeDb(db);
  return db[collection][idx];
}

export async function remove(collection, id) {
  const db = await readDb();
  const idx = (db[collection] ?? []).findIndex((item) => item.id === id);
  if (idx === -1) return false;
  db[collection].splice(idx, 1);
  await writeDb(db);
  return true;
}

export async function getSettings() {
  const db = await readDb();
  return db.settings;
}

export async function updateSettings(data) {
  const db = await readDb();
  db.settings = { ...db.settings, ...data };
  await writeDb(db);
  return db.settings;
}
