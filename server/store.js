import { DatabaseSync } from "node:sqlite";
export function openStore(path) {
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS listings(id INTEGER PRIMARY KEY,name TEXT NOT NULL,description TEXT NOT NULL,price INTEGER NOT NULL,image TEXT,status TEXT NOT NULL DEFAULT 'available',auction INTEGER NOT NULL DEFAULT 0,ends TEXT);
 CREATE TABLE IF NOT EXISTS slots(id INTEGER PRIMARY KEY,date TEXT NOT NULL,place TEXT NOT NULL,mode TEXT NOT NULL,capacity INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY,listing_id INTEGER NOT NULL REFERENCES listings(id),slot_id INTEGER NOT NULL REFERENCES slots(id),name TEXT NOT NULL,phone TEXT NOT NULL,address TEXT NOT NULL DEFAULT '',created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,status TEXT NOT NULL DEFAULT 'pending');
 CREATE TABLE IF NOT EXISTS bids(id INTEGER PRIMARY KEY,listing_id INTEGER NOT NULL REFERENCES listings(id),name TEXT NOT NULL,phone TEXT NOT NULL,amount INTEGER NOT NULL,created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,expires INTEGER NOT NULL);`);
  return db;
}
export function reserve(db, { listingId, slotId, name, phone, address = "" }) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const l = db.prepare("SELECT * FROM listings WHERE id=?").get(listingId);
    if (!l || l.status !== "available" || l.auction)
      throw Error("This kazun is no longer available for purchase.");
    const s = db
      .prepare(
        "SELECT *, (SELECT count(*) FROM orders WHERE slot_id=slots.id AND status!='cancelled') AS booked FROM slots WHERE id=?",
      )
      .get(slotId);
    if (!s || Date.parse(s.date) <= Date.now() || s.booked >= s.capacity)
      throw Error("This appointment is no longer available.");
    if (s.mode === "delivery" && !address.trim())
      throw Error("Please provide a delivery address.");
    const r = db
      .prepare(
        "INSERT INTO orders(listing_id,slot_id,name,phone,address) VALUES(?,?,?,?,?)",
      )
      .run(listingId, slotId, name, phone, address);
    db.prepare("UPDATE listings SET status='reserved' WHERE id=?").run(
      listingId,
    );
    db.exec("COMMIT");
    return Number(r.lastInsertRowid);
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
