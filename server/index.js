import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import multer from "multer";
import sharp from "sharp";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openStore, reserve } from "./store.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = process.env.DATA_DIR || path.join(root, "data");
mkdirSync(path.join(data, "uploads"), { recursive: true });
if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length < 16)
  throw Error("ADMIN_PASSWORD must contain at least 16 characters.");
const db = openStore(path.join(data, "kazuni.sqlite"));
const app = express();
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "data:"],
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "upgrade-insecure-requests":
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
const writeLimit = rateLimit({
  windowMs: 15 * 60000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const loginLimit = rateLimit({
  windowMs: 15 * 60000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
// All browser mutations must originate from the configured website.
app.use("/api", (req, res, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.headers.origin;
    const allowed = process.env.APP_ORIGIN || "http://localhost:5173";
    if (origin !== allowed)
      return res.status(403).json({ error: "Request origin not allowed." });
  }
  next();
});
const hash = (t) => createHash("sha256").update(t).digest("hex");
function session(req) {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("kazuni_session="));
  if (!cookie) return null;
  const token = cookie.slice(15);
  return db
    .prepare("SELECT * FROM sessions WHERE token=? AND expires>?")
    .get(hash(token), Date.now());
}
function admin(req, res, next) {
  if (!session(req))
    return res.status(401).json({ error: "Please sign in as admin." });
  next();
}
function fail(message) {
  const e = Error(message);
  e.status = 400;
  throw e;
}
function str(v, label, max = 200) {
  if (typeof v !== "string" || !v.trim() || v.trim().length > max)
    fail(`Please enter a valid ${label}.`);
  return v.trim();
}
function integer(v, label, min = 1, max = 100000000) {
  if (!Number.isSafeInteger(v) || v < min || v > max) fail(`Invalid ${label}.`);
  return v;
}
function customer(b) {
  return {
    name: str(b.name, "name", 100),
    phone: str(b.phone, "phone number", 30),
  };
}
function phone(b) {
  const c = customer(b);
  if (
    !/^[+\d ()-]{6,30}$/.test(c.phone) ||
    c.phone.replace(/\D/g, "").length < 6
  )
    fail("Please enter a valid phone number.");
  return c;
}
app.get("/api/catalog", (req, res) =>
  res.json({
    listings: db
      .prepare(
        `SELECT l.*,COALESCE((SELECT MAX(amount) FROM bids WHERE listing_id=l.id),0) AS highestBid,(SELECT COUNT(*) FROM bids WHERE listing_id=l.id) AS bidCount FROM listings l ${session(req) ? "" : "WHERE status!='hidden'"} ORDER BY id DESC`,
      )
      .all(),
    slots: db
      .prepare(
        "SELECT *, (SELECT COUNT(*) FROM orders WHERE slot_id=slots.id AND status!='cancelled') AS booked FROM slots WHERE date>? ORDER BY date",
      )
      .all(new Date().toISOString())
      .filter((s) => s.booked < s.capacity),
  }),
);
app.post("/api/orders", writeLimit, (req, res) => {
  const c = phone(req.body);
  const listingId = integer(req.body.listingId, "listing");
  const slotId = integer(req.body.slotId, "appointment");
  const address =
    typeof req.body.address === "string" ? req.body.address.trim() : "";
  if (address.length > 500) fail("Delivery address is too long.");
  try {
    res
      .status(201)
      .json({ id: reserve(db, { listingId, slotId, ...c, address }) });
  } catch (e) {
    fail(e.message);
  }
});
app.post("/api/bids", writeLimit, (req, res) => {
  const c = phone(req.body);
  const id = integer(req.body.listingId, "listing");
  const amount = integer(req.body.amount, "bid");
  const l = db.prepare("SELECT * FROM listings WHERE id=?").get(id);
  if (
    !l ||
    !l.auction ||
    l.status !== "available" ||
    !l.ends ||
    Date.parse(l.ends) <= Date.now()
  )
    fail("This auction is closed.");
  const top =
    db
      .prepare("SELECT MAX(amount) AS amount FROM bids WHERE listing_id=?")
      .get(id).amount || 0;
  if (amount < l.price || amount <= top)
    fail(
      "Your bid must meet the starting price and exceed the current highest bid.",
    );
  db.prepare(
    "INSERT INTO bids(listing_id,name,phone,amount) VALUES(?,?,?,?)",
  ).run(id, c.name, c.phone, amount);
  res.status(201).json({ ok: true });
});
app.get("/api/admin/session", (req, res) =>
  res.json({
    authenticated: !!session(req),
    configured: !!process.env.ADMIN_PASSWORD,
  }),
);
app.post("/api/admin/login", loginLimit, (req, res) => {
  const password = process.env.ADMIN_PASSWORD;
  if (!password)
    return res
      .status(503)
      .json({
        error:
          "Admin access is not configured. Set ADMIN_PASSWORD on the server.",
      });
  const input = typeof req.body.password === "string" ? req.body.password : "";
  if (
    input.length > 256 ||
    !timingSafeEqual(
      scryptSync(input, "kazuni-admin-v1", 64),
      scryptSync(password, "kazuni-admin-v1", 64),
    )
  )
    return res.status(401).json({ error: "Incorrect password." });
  db.prepare("DELETE FROM sessions WHERE expires<=?").run(Date.now());
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions VALUES(?,?)").run(
    hash(token),
    Date.now() + 8 * 3600000,
  );
  res
    .cookie("kazuni_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 3600000,
      path: "/",
    })
    .json({ ok: true });
});
app.post("/api/admin/logout", admin, (req, res) => {
  const s = session(req);
  db.prepare("DELETE FROM sessions WHERE token=?").run(s.token);
  res.clearCookie("kazuni_session", { path: "/" }).json({ ok: true });
});
app.get("/api/admin/data", admin, (req, res) =>
  res.json({
    orders: db
      .prepare(
        "SELECT o.*,l.name AS listingName,s.date,s.place,s.mode FROM orders o JOIN listings l ON l.id=o.listing_id JOIN slots s ON s.id=o.slot_id ORDER BY o.id DESC",
      )
      .all(),
    bids: db
      .prepare(
        "SELECT b.*,l.name AS listingName FROM bids b JOIN listings l ON l.id=b.listing_id ORDER BY b.amount DESC",
      )
      .all(),
    slots: db.prepare("SELECT * FROM slots ORDER BY date").all(),
  }),
);
app.post("/api/admin/listings", admin, (req, res) => {
  const b = req.body;
  const name = str(b.name, "name", 100),
    description = str(b.description, "description", 3000),
    price = integer(b.price, "price");
  const auction = b.auction === true;
  const ends = auction ? str(b.ends, "auction deadline", 40) : null;
  if (
    auction &&
    (!Number.isFinite(Date.parse(ends)) || Date.parse(ends) <= Date.now())
  )
    fail("Auction deadline must be in the future.");
  const image =
    typeof b.image === "string" &&
    /^\/uploads\/[a-f0-9]{32}\.webp$/.test(b.image)
      ? b.image
      : null;
  if (!image || !existsSync(path.join(data, image)))
    fail("Please upload a picture.");
  const r = db
    .prepare(
      "INSERT INTO listings(name,description,price,image,auction,ends) VALUES(?,?,?,?,?,?)",
    )
    .run(
      name,
      description,
      price,
      image,
      Number(auction),
      ends ? new Date(ends).toISOString() : null,
    );
  res.status(201).json({ id: Number(r.lastInsertRowid) });
});
app.patch("/api/admin/listings/:id", admin, (req, res) => {
  const id = integer(Number(req.params.id), "listing");
  const b = req.body;
  const existing = db.prepare("SELECT * FROM listings WHERE id=?").get(id);
  if (!existing) fail("Listing not found.");
  if (b.status !== undefined) {
    if (!["available", "reserved", "sold", "hidden"].includes(b.status))
      fail("Invalid status.");
    if (
      b.status === "available" &&
      db
        .prepare(
          "SELECT id FROM orders WHERE listing_id=? AND status!='cancelled'",
        )
        .get(id)
    )
      fail("Cancel the active order before making this listing available.");
    db.prepare("UPDATE listings SET status=? WHERE id=?").run(b.status, id);
  }
  if (b.name !== undefined) {
    const name = str(b.name, "name", 100),
      description = str(b.description, "description", 3000),
      price = integer(b.price, "price");
    if (
      db.prepare("SELECT id FROM bids WHERE listing_id=?").get(id) &&
      price !== existing.price
    )
      fail("The starting price cannot change after bidding begins.");
    db.prepare(
      "UPDATE listings SET name=?,description=?,price=? WHERE id=?",
    ).run(name, description, price, id);
  }
  if (b.image !== undefined) {
    if (
      typeof b.image !== "string" ||
      !/^\/uploads\/[a-f0-9]{32}\.webp$/.test(b.image) ||
      !existsSync(path.join(data, b.image))
    )
      fail("Invalid uploaded picture.");
    db.prepare("UPDATE listings SET image=? WHERE id=?").run(b.image, id);
  }
  res.json({ ok: true });
});
app.post("/api/admin/slots", admin, (req, res) => {
  const b = req.body,
    date = str(b.date, "date", 40),
    place = str(b.place, "location", 200),
    capacity = integer(b.capacity, "capacity", 1, 100);
  if (!["pickup", "delivery"].includes(b.mode))
    fail("Choose pickup or delivery.");
  if (!Number.isFinite(Date.parse(date)) || Date.parse(date) <= Date.now())
    fail("Appointment must be in the future.");
  db.prepare("INSERT INTO slots(date,place,mode,capacity) VALUES(?,?,?,?)").run(
    new Date(date).toISOString(),
    place,
    b.mode,
    capacity,
  );
  res.status(201).json({ ok: true });
});
app.delete("/api/admin/slots/:id", admin, (req, res) => {
  const id = integer(Number(req.params.id), "appointment");
  if (db.prepare("SELECT id FROM orders WHERE slot_id=?").get(id))
    fail("Appointments with orders cannot be removed.");
  db.prepare("DELETE FROM slots WHERE id=?").run(id);
  res.json({ ok: true });
});
app.patch("/api/admin/orders/:id", admin, (req, res) => {
  const id = integer(Number(req.params.id), "order"),
    status = req.body.status;
  if (!["confirmed", "completed", "cancelled"].includes(status))
    fail("Invalid order status.");
  const o = db.prepare("SELECT * FROM orders WHERE id=?").get(id);
  if (!o) fail("Order not found.");
  if (o.status === "cancelled" || o.status === "completed")
    fail("This order is already closed.");
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
    db.prepare("UPDATE listings SET status=? WHERE id=?").run(
      status === "cancelled"
        ? "available"
        : status === "completed"
          ? "sold"
          : "reserved",
      o.listing_id,
    );
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  res.json({ ok: true });
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});
app.post(
  "/api/admin/upload",
  admin,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) fail("Choose an image.");
      const filename = randomBytes(16).toString("hex") + ".webp";
      await sharp(req.file.buffer, {
        limitInputPixels: 25000000,
        animated: false,
      })
        .rotate()
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(data, "uploads", filename));
      res.status(201).json({ url: "/uploads/" + filename });
    } catch (e) {
      e.status = 400;
      next(e);
    }
  },
);
app.use(
  "/uploads",
  express.static(path.join(data, "uploads"), {
    immutable: true,
    maxAge: "1y",
    dotfiles: "deny",
  }),
);
if (existsSync(path.join(root, "dist"))) {
  app.use(express.static(path.join(root, "dist")));
  app.get("/{*path}", (req, res) => {
    if (req.path.startsWith("/api/"))
      return res.status(404).json({ error: "Not found." });
    res.sendFile(path.join(root, "dist/index.html"));
  });
}
app.use((err, req, res, next) => {
  const status = err.status || (err instanceof multer.MulterError ? 400 : 500);
  if (status >= 500) console.error("Request failed:", err.message);
  res
    .status(status)
    .json({
      error:
        status >= 500 ? "Something went wrong. Please try again." : err.message,
    });
});
const port = Number(process.env.PORT || 3001);
app.listen(port, "0.0.0.0", () =>
  console.log(
    `Kazuni server listening on ${port}. Admin ${process.env.ADMIN_PASSWORD ? "configured" : "disabled until ADMIN_PASSWORD is set"}.`,
  ),
);
