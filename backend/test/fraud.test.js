/**
 * test/fraud.test.js
 * Tests every endpoint registered under /api/fraud (all admin-only)
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { getBase } from "./setup.js";

const uid = () => Math.random().toString(36).slice(2, 8);

let base, userToken, adminToken;

const post  = (url, body, tok) => fetch(url, { method: "POST",  headers: { "Content-Type": "application/json", ...(tok ? { Authorization: `Bearer ${tok}` } : {}) }, body: JSON.stringify(body) });
const get   = (url, tok)       => fetch(url, { headers: { Authorization: `Bearer ${tok}` } });
const patch = (url, body, tok) => fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` }, body: JSON.stringify(body) });

before(async () => {
  base = await getBase();
  const pwd = "FraudPass@1234";

  const email = `fr_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Fraud User", email, password: pwd });
  userToken = ((await (await post(`${base}/api/auth/login`, { email, password: pwd })).json())).token;

  const adminEmail = `fradm_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Fraud Admin", email: adminEmail, password: pwd, role: "admin" });
  adminToken = ((await (await post(`${base}/api/auth/login`, { email: adminEmail, password: pwd })).json())).token;
});

describe("Fraud Routes (admin-only)", () => {
  let fraudLogId;

  describe("GET /api/fraud/", () => {
    it("admin gets all fraud logs", async () => {
      const res  = await get(`${base}/api/fraud/`, adminToken);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
      assert.equal(body.success, true);
      const logs = body.data?.fraudLogs ?? body.data?.logs ?? [];
      if (logs.length) fraudLogId = logs[0]._id;
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/fraud/`, userToken)).status, 403);
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/fraud/`)).status, 401);
    });
  });

  describe("GET /api/fraud/stats", () => {
    it("admin gets fraud statistics", async () => {
      const body = await (await get(`${base}/api/fraud/stats`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/fraud/stats`, userToken)).status, 403);
    });
  });

  describe("GET /api/fraud/:id", () => {
    it("fetches a fraud log by id (skips if db empty)", async () => {
      if (!fraudLogId) return;
      const body = await (await get(`${base}/api/fraud/${fraudLogId}`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 400 or 404 for unknown id", async () => {
      const s = (await get(`${base}/api/fraud/000000000000000000000000`, adminToken)).status;
      assert.ok([400, 404].includes(s));
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/fraud/000000000000000000000000`, userToken)).status, 403);
    });
  });

  describe("PATCH /api/fraud/:id/review", () => {
    it("admin reviews a fraud log (skips if db empty)", async () => {
      if (!fraudLogId) return;
      const s = (await patch(`${base}/api/fraud/${fraudLogId}/review`, { status: "reviewed", note: "ok" }, adminToken)).status;
      assert.ok([200, 400].includes(s));
    });

    it("→ 400 or 404 for unknown id", async () => {
      const s = (await patch(`${base}/api/fraud/000000000000000000000000/review`, { status: "reviewed" }, adminToken)).status;
      assert.ok([400, 404].includes(s));
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await patch(`${base}/api/fraud/000000000000000000000000/review`, { status: "reviewed" }, userToken)).status, 403);
    });
  });
});
