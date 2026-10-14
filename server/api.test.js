import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";
test("HTTP workflow: authentication, uploads, listings, appointments, orders, auctions, privacy and CSRF", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "kazuni-test-"));
  const password = randomBytes(24).toString("hex");
  const port = 19471;
  const origin = `http://localhost:${port}`;
  let cookie = "";
  const child = spawn(process.execPath, ["server/index.js"], {
    env: {
      ...process.env,
      DATA_DIR: dir,
      ADMIN_PASSWORD: password,
      APP_ORIGIN: origin,
      PORT: String(port),
    },
  });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(Error("Server startup timeout")),
        10000,
      );
      child.stdout.on("data", (d) => {
        if (d.toString().includes("listening")) {
          clearTimeout(timer);
          resolve();
        }
      });
      child.on("exit", (code) => {
        clearTimeout(timer);
        reject(Error("Server exited " + code));
      });
    });
    async function req(url, body, method = "POST", options = {}) {
      const form = body instanceof FormData;
      return fetch(origin + "/api" + url, {
        method,
        headers: {
          ...(body && !form ? { "content-type": "application/json" } : {}),
          origin: options.origin || origin,
          ...(!options.anonymous && cookie ? { cookie } : {}),
        },
        body: body ? (form ? body : JSON.stringify(body)) : undefined,
      });
    }
    assert.equal((await req("/admin/data", null, "GET")).status, 401);
    assert.equal(
      (await req("/admin/login", { password: "wrong" })).status,
      401,
    );
    const login = await req("/admin/login", { password });
    assert.equal(login.status, 200);
    cookie = login.headers.get("set-cookie").split(";")[0];
    assert.match(login.headers.get("set-cookie"), /HttpOnly/);
    assert.match(login.headers.get("set-cookie"), /SameSite=Strict/);
    assert.equal((await req("/admin/slots", {}, "POST")).status, 400);
    assert.equal(
      (
        await req("/admin/slots", {}, "POST", {
          origin: "https://attacker.example",
        })
      ).status,
      403,
    );
    const invalid = new FormData();
    invalid.append("image", new Blob(["not an image"]), "bad.png");
    assert.equal((await req("/admin/upload", invalid)).status, 400);
    const buffer = await sharp({
      create: { width: 50, height: 50, channels: 3, background: "#aabbcc" },
    })
      .png()
      .toBuffer();
    const f = new FormData();
    f.append("image", new Blob([buffer]), "image.png");
    const uploaded = await req("/admin/upload", f);
    assert.equal(uploaded.status, 201);
    const { url: image } = await uploaded.json();
    assert.match(image, /\.webp$/);
    const listing = await req("/admin/listings", {
      name: "Test kazun",
      description: "Stone",
      price: 10000,
      image,
    });
    assert.equal(listing.status, 201);
    const { id } = await listing.json();
    const slot = await req("/admin/slots", {
      date: new Date(Date.now() + 86400000).toISOString(),
      place: "Pula",
      mode: "pickup",
      capacity: 1,
    });
    assert.equal(slot.status, 201);
    const cat = await (
      await req("/catalog", null, "GET", { anonymous: true })
    ).json();
    assert.equal(cat.listings.length, 1);
    assert.equal(cat.slots.length, 1);
    const order = await req(
      "/orders",
      {
        listingId: id,
        slotId: cat.slots[0].id,
        name: "Test buyer",
        phone: "+385991234567",
      },
      "POST",
      { anonymous: true },
    );
    assert.equal(order.status, 201);
    const orderId = (await order.json()).id;
    assert.equal(
      (
        await req(
          "/orders",
          {
            listingId: id,
            slotId: cat.slots[0].id,
            name: "Other buyer",
            phone: "+385991234567",
          },
          "POST",
          { anonymous: true },
        )
      ).status,
      400,
    );
    assert.equal(
      (await req("/admin/data", null, "GET", { anonymous: true })).status,
      401,
    );
    const publicCatalog = await (
      await req("/catalog", null, "GET", { anonymous: true })
    ).json();
    assert.equal(publicCatalog.listings[0].status, "reserved");
    assert.equal(publicCatalog.slots.length, 0);
    assert.ok(!JSON.stringify(publicCatalog).includes("Test buyer"));
    assert.equal(
      (await req("/admin/listings/" + id, { status: "available" }, "PATCH"))
        .status,
      400,
    );
    assert.equal(
      (await req("/admin/orders/" + orderId, { status: "cancelled" }, "PATCH"))
        .status,
      200,
    );
    const released = await (
      await req("/catalog", null, "GET", { anonymous: true })
    ).json();
    assert.equal(released.slots.length, 1);
    assert.equal(released.listings[0].status, "available");
    const auction = await req("/admin/listings", {
      name: "Auction",
      description: "Auction kazun",
      price: 10000,
      image,
      auction: true,
      ends: new Date(Date.now() + 86400000).toISOString(),
    });
    assert.equal(auction.status, 201);
    const auctionId = (await auction.json()).id;
    assert.equal(
      (
        await req(
          "/bids",
          {
            listingId: auctionId,
            name: "Bidder",
            phone: "+49123456789",
            amount: 9000,
          },
          "POST",
          { anonymous: true },
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await req(
          "/bids",
          {
            listingId: auctionId,
            name: "Bidder",
            phone: "+49123456789",
            amount: 10000,
          },
          "POST",
          { anonymous: true },
        )
      ).status,
      201,
    );
    assert.equal(
      (
        await req(
          "/bids",
          {
            listingId: auctionId,
            name: "Bidder 2",
            phone: "+49123456789",
            amount: 10000,
          },
          "POST",
          { anonymous: true },
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await req(
          "/admin/listings/" + auctionId,
          { name: "Auction", description: "Updated", price: 9000 },
          "PATCH",
        )
      ).status,
      400,
    );
    assert.equal(
      (await req("/admin/listings/" + id, { status: "hidden" }, "PATCH"))
        .status,
      200,
    );
    const visible = await (
      await req("/catalog", null, "GET", { anonymous: true })
    ).json();
    assert.equal(visible.listings.length, 1);
    assert.ok(!JSON.stringify(visible).includes("Bidder"));
    assert.equal(visible.listings[0].highestBid, 10000);
    assert.equal((await req("/admin/logout", {})).status, 200);
    assert.equal((await req("/admin/data", null, "GET")).status, 401);
  } finally {
    child.kill();
    await new Promise((resolve) => {
      if (child.exitCode !== null) resolve();
      else child.on("exit", resolve);
    });
    await rm(dir, { recursive: true, force: true });
  }
});
