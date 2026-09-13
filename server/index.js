import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { issueToken, requireAuth } from "./auth.js";
import {
  COLLECTIONS,
  list,
  get,
  create,
  update,
  remove,
  getSettings,
  updateSettings,
} from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

const FILTERABLE = { members: "category", publications: "type" };

function validCollection(req, res, next) {
  if (!COLLECTIONS.includes(req.params.collection)) {
    return res.status(404).json({ error: "Unknown collection" });
  }
  next();
}

// --- Auth ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ token: issueToken(username) });
  }
  return res.status(401).json({ error: "Invalid username or password" });
});

// --- Site settings (declared before the generic routes so it is not treated as a collection) ---
app.get("/api/settings", async (req, res) => {
  res.json(await getSettings());
});

app.put("/api/settings", requireAuth, async (req, res) => {
  res.json(await updateSettings(req.body ?? {}));
});

// --- Photo upload ---
app.post("/api/upload", requireAuth, upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

// --- Generic content collections ---
app.get("/api/:collection", validCollection, async (req, res) => {
  const { collection } = req.params;
  const filterKey = FILTERABLE[collection];
  const filters =
    filterKey && req.query[filterKey] ? { [filterKey]: req.query[filterKey] } : {};
  res.json(await list(collection, filters));
});

app.get("/api/:collection/:id", validCollection, async (req, res) => {
  const item = await get(req.params.collection, req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

app.post("/api/:collection", validCollection, requireAuth, async (req, res) => {
  res.status(201).json(await create(req.params.collection, req.body ?? {}));
});

app.put("/api/:collection/:id", validCollection, requireAuth, async (req, res) => {
  const item = await update(req.params.collection, req.params.id, req.body ?? {});
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

app.delete("/api/:collection/:id", validCollection, requireAuth, async (req, res) => {
  const ok = await remove(req.params.collection, req.params.id);
  if (!ok) return res.status(404).json({ error: "Item not found" });
  res.status(204).end();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Lab server API listening on http://localhost:${PORT}`);
});
