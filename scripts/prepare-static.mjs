// Copies the backend's database and uploaded images into public/ so the
// published static build can serve them without the API running.

import { cp, mkdir, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dbSource = path.join(root, "server", "data", "db.json");
const uploadsSource = path.join(root, "server", "uploads");
const dataTarget = path.join(root, "public", "data");
const uploadsTarget = path.join(root, "public", "uploads");

await rm(dataTarget, { recursive: true, force: true });
await rm(uploadsTarget, { recursive: true, force: true });

await mkdir(dataTarget, { recursive: true });
await cp(dbSource, path.join(dataTarget, "db.json"));
console.log("copied server/data/db.json → public/data/db.json");

if (existsSync(uploadsSource)) {
  const files = (await readdir(uploadsSource)).filter((f) => !f.startsWith("."));
  await mkdir(uploadsTarget, { recursive: true });
  for (const file of files) {
    await cp(path.join(uploadsSource, file), path.join(uploadsTarget, file));
  }
  console.log(`copied ${files.length} upload(s) → public/uploads/`);
}
