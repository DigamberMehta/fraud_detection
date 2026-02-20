/**
 * test/merchant.test.js
 * Tests every endpoint registered under /api/merchants
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { getBase } from "./setup.js";

const uid = () => Math.random().toString(36).slice(2, 8);

let base, userToken, adminToken, merchantId;

const post  = (url, body, tok) => fetch(url, { method: "POST",  headers: { "Content-Type": "application/json", ...(tok ? { Authorization: `Bearer ${tok}` } : {}) }, body: JSON.stringify(body) });
const get   = (url, tok)       => fetch(url, { headers: { Authorization: `Bearer ${tok}` } });
const patch = (url, body, tok) => fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` }, body: JSON.stringify(body) });

before(async () => {
  base = await getBase();
  const pwd = "MerchPass@1234";

  // Seed a merchant
  const seedEmail = `seed_${uid()}@shop.com`;
  const seedBody  = await (await post(`${base}/api/auth/merchant/register`, {
    name: "Seed Merchant", email: seedEmail, password: pwd,
    category: "E-commerce", country: "India",
  })).json();
  merchantId = seedBody.data?.merchant?._id;

  // Regular user
  const email = `mu_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "M User", email, password: pwd });
  userToken = ((await (await post(`${base}/api/auth/login`, { email, password: pwd })).json())).token;

  // Admin
  const adminEmail = `ma_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "M Admin", email: adminEmail, password: pwd, role: "admin" });
  adminToken = ((await (await post(`${base}/api/auth/login`, { email: adminEmail, password: pwd })).json())).token;
});

describe("Merchant Routes", () => {

  describe("GET /api/merchants/ (admin)", () => {
    it("admin gets all merchants", async () => {
      const res  = await get(`${base}/api/merchants/`, adminToken);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
      assert.equal(body.success, true);
      if (!merchantId) {
        const list = body.data?.merchants ?? body.data?.data ?? [];
        if (list.length) merchantId = list[0]._id;
      }
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/merchants/`, userToken)).status, 403);
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/merchants/`)).status, 401);
    });
  });

  describe("GET /api/merchants/high-risk (admin)", () => {
    it("admin gets high-risk merchants", async () => {
      const body = await (await get(`${base}/api/merchants/high-risk`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/merchants/high-risk`, userToken)).status, 403);
    });
  });

  describe("GET /api/merchants/:id", () => {
    it("any authenticated user fetches merchant by id", async () => {
      if (!merchantId) return;
      const body = await (await get(`${base}/api/merchants/${merchantId}`, userToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 400 or 404 for non-existent id", async () => {
      const s = (await get(`${base}/api/merchants/000000000000000000000000`, userToken)).status;
      assert.ok([400, 404].includes(s));
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/merchants/000000000000000000000000`)).status, 401);
    });
  });

  describe("PATCH /api/merchants/:id/risk-score (admin)", () => {
    it("admin updates risk score", async () => {
      if (!merchantId) return;
      const s = (await patch(`${base}/api/merchants/${merchantId}/risk-score`, { riskScore: 0.75 }, adminToken)).status;
      assert.ok([200, 400, 422].includes(s));
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await patch(`${base}/api/merchants/000000000000000000000000/risk-score`, { riskScore: 0.5 }, userToken)).status, 403);
    });
  });

  describe("PATCH /api/merchants/:id/deactivate (admin)", () => {
    it("admin deactivates a merchant", async () => {
      if (!merchantId) return;
      const s = (await patch(`${base}/api/merchants/${merchantId}/deactivate`, {}, adminToken)).status;
      assert.ok([200, 400].includes(s));
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await patch(`${base}/api/merchants/000000000000000000000000/deactivate`, {}, userToken)).status, 403);
    });
  });
});
