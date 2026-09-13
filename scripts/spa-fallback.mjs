// GitHub Pages serves 404.html for any path it does not recognise. Serving the
// app's index.html there lets client-side routes like /news load directly.

import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await copyFile(path.join(root, "dist", "index.html"), path.join(root, "dist", "404.html"));
console.log("created dist/404.html for client-side routing");
