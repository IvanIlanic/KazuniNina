import { test } from "node:test";
import assert from "node:assert/strict";
import { openStore, reserve } from "./store.js";
function fixture() {
  const db = openStore(":memory:");
  db.prepare("INSERT INTO listings(name,description,price) VALUES(?,?,?)").run(
    "Kazun",
    "Stone",
    10000,
  );
  db.prepare("INSERT INTO listings(name,description,price) VALUES(?,?,?)").run(
    "Kazun 2",
    "Stone",
    20000,
  );
  db.prepare("INSERT INTO slots(date,place,mode,capacity) VALUES(?,?,?,?)").run(
    new Date(Date.now() + 86400000).toISOString(),
    "Pula",
    "pickup",
    1,
  );
  return db;
}
const customer = {
  name: "Buyer",
  phone: "+385991234567",
  listingId: 1,
  slotId: 1,
};
test("successful reservation persists details and removes listing from available stock", () => {
  const db = fixture();
  assert.equal(reserve(db, customer), 1);
  assert.equal(
    db.prepare("SELECT status FROM listings WHERE id=1").get().status,
    "reserved",
  );
  assert.equal(
    db.prepare("SELECT phone FROM orders").get().phone,
    customer.phone,
  );
  db.close();
});
test("a unique listing cannot be reserved twice", () => {
  const db = fixture();
  reserve(db, customer);
  assert.throws(() => reserve(db, customer), /no longer available/);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM orders").get().n, 1);
  db.close();
});
test("full appointment rejects another listing and rolls back without changing inventory", () => {
  const db = fixture();
  reserve(db, customer);
  assert.throws(
    () => reserve(db, { ...customer, listingId: 2 }),
    /no longer available/,
  );
  assert.equal(
    db.prepare("SELECT status FROM listings WHERE id=2").get().status,
    "available",
  );
  db.close();
});
test("delivery needs an address and expired appointments cannot be booked", () => {
  const db = fixture();
  db.prepare("UPDATE slots SET mode='delivery'").run();
  assert.throws(() => reserve(db, customer), /address/);
  assert.equal(reserve(db, { ...customer, address: "A real address" }), 1);
  db.close();
  const expired = fixture();
  expired.prepare("UPDATE slots SET date=?").run("2000-01-01T12:00:00.000Z");
  assert.throws(() => reserve(expired, customer), /no longer available/);
  expired.close();
});
test("auction listings cannot be purchased outside bidding", () => {
  const db = fixture();
  db.prepare("UPDATE listings SET auction=1").run();
  assert.throws(() => reserve(db, customer), /no longer available/);
  db.close();
});
