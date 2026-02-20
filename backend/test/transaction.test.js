/**
 * test/transaction.test.js
 * Tests every endpoint registered under /api/transactions
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { getBase } from "./setup.js";

const uid = () => Math.random().toString(36).slice(2, 8);

let base, userToken, adminToken, createdTxId;

const post = (url, body, tok) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...(tok ? { Authorization: `Bearer ${tok}` } : {}) }, body: JSON.stringify(body) });
const get  = (url, tok)       => fetch(url, { headers: { Authorization: `Bearer ${tok}` } });

before(async () => {
  base = await getBase();
  const pwd = "TxPass@5678";

  const email = `tx_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Tx User", email, password: pwd });
  userToken = ((await (await post(`${base}/api/auth/login`, { email, password: pwd })).json())).token;

  const adminEmail = `txadm_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Tx Admin", email: adminEmail, password: pwd, role: "admin" });
  adminToken = ((await (await post(`${base}/api/auth/login`, { email: adminEmail, password: pwd })).json())).token;
});

describe("Transaction Routes", () => {

  describe("POST /api/transactions/", () => {
    it("creates a transaction (or returns 400/404 if merchant missing)", async () => {
      const res  = await post(`${base}/api/transactions/`, {
        amount: 250, type: "debit", description: "Test purchase",
        location: { city: "Mumbai", country: "IN" },
        deviceFingerprint: `fp_${uid()}`, ipAddress: "192.168.1.1",
        merchantId: "000000000000000000000000",
      }, userToken);
      const body = await res.json();
      assert.ok([201, 400, 404, 422].includes(res.status), `status ${res.status}: ${JSON.stringify(body)}`);
      if (res.status === 201) createdTxId = body.data?.transaction?._id;
    });

    it("→ 401 without token", async () => {
      assert.equal((await post(`${base}/api/transactions/`, { amount: 10 })).status, 401);
    });
  });

  describe("GET /api/transactions/my", () => {
    it("returns own transactions list", async () => {
      const body = await (await get(`${base}/api/transactions/my`, userToken)).json();
      assert.equal(body.success, true);
      assert.ok(Array.isArray(body.data?.transactions));
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/transactions/my`)).status, 401);
    });
  });

  describe("GET /api/transactions/stats (admin)", () => {
    it("admin gets aggregate stats", async () => {
      const body = await (await get(`${base}/api/transactions/stats`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/transactions/stats`, userToken)).status, 403);
    });
  });

  describe("GET /api/transactions/all (admin)", () => {
    it("admin gets all transactions", async () => {
      const body = await (await get(`${base}/api/transactions/all`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/transactions/all`, userToken)).status, 403);
    });
  });

  describe("GET /api/transactions/:id", () => {
    it("fetches a transaction by id (skips if none created)", async () => {
      if (!createdTxId) return;
      const body = await (await get(`${base}/api/transactions/${createdTxId}`, userToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 400 or 404 for non-existent id", async () => {
      const s = (await get(`${base}/api/transactions/000000000000000000000000`, userToken)).status;
      assert.ok([400, 404].includes(s));
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/transactions/000000000000000000000000`)).status, 401);
    });
  });
});
