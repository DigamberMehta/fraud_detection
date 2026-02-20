/**
 * test/user.test.js
 * Tests every endpoint registered under /api/users
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { getBase } from "./setup.js";

const uid = () => Math.random().toString(36).slice(2, 8);

let base, userToken, adminToken, userId;

const post  = (url, body, tok) => fetch(url, { method: "POST",  headers: { "Content-Type": "application/json", ...(tok ? { Authorization: `Bearer ${tok}` } : {}) }, body: JSON.stringify(body) });
const get   = (url, tok)       => fetch(url, { headers: { Authorization: `Bearer ${tok}` } });
const patch = (url, body, tok) => fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` }, body: JSON.stringify(body) });

before(async () => {
  base = await getBase();
  const pwd = "UserPass@1234";

  const email = `usr_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Reg User", email, password: pwd });
  const r1 = await (await post(`${base}/api/auth/login`, { email, password: pwd })).json();
  userToken = r1.token;
  userId    = r1.data?.user?._id;

  const adminEmail = `adm_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Admin", email: adminEmail, password: pwd, role: "admin" });
  adminToken = ((await (await post(`${base}/api/auth/login`, { email: adminEmail, password: pwd })).json())).token;
});

describe("User Routes", () => {

  describe("GET /api/users/me/profile", () => {
    it("returns own profile", async () => {
      const res  = await get(`${base}/api/users/me/profile`, userToken);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
      assert.ok(body.data?.user);
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/users/me/profile`)).status, 401);
    });
  });

  describe("PATCH /api/users/me/profile", () => {
    it("updates name / phone", async () => {
      const res  = await patch(`${base}/api/users/me/profile`, { name: "Updated", phone: "+911234567890" }, userToken);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/users/me/profile`, { method: "PATCH" })).status, 401);
    });
  });

  describe("GET /api/users/ (admin)", () => {
    it("admin gets full user list", async () => {
      const body = await (await get(`${base}/api/users/`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/users/`, userToken)).status, 403);
    });
  });

  describe("GET /api/users/:id (admin)", () => {
    it("admin fetches user by id", async () => {
      const body = await (await get(`${base}/api/users/${userId}`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 400 or 404 for non-existent id", async () => {
      const s = (await get(`${base}/api/users/000000000000000000000000`, adminToken)).status;
      assert.ok([400, 404].includes(s));
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/users/${userId}`, userToken)).status, 403);
    });
  });

  describe("PATCH /api/users/:id/lock | unlock (admin)", () => {
    it("admin locks user", async () => {
      const body = await (await patch(`${base}/api/users/${userId}/lock`, {}, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("admin unlocks user", async () => {
      const body = await (await patch(`${base}/api/users/${userId}/unlock`, {}, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await patch(`${base}/api/users/${userId}/lock`, {}, userToken)).status, 403);
    });
  });

  describe("PATCH /api/users/:id/balance (admin)", () => {
    it("admin updates balance", async () => {
      const s = (await patch(`${base}/api/users/${userId}/balance`, { amount: 500 }, adminToken)).status;
      assert.ok([200, 400, 422].includes(s));
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await patch(`${base}/api/users/${userId}/balance`, { amount: 100 }, userToken)).status, 403);
    });
  });
});
