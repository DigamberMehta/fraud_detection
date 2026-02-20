/**
 * test/auth.test.js
 * Tests every endpoint registered under /api/auth
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { getBase } from "./setup.js";

const uid = () => Math.random().toString(36).slice(2, 8);

let base;
let token;
const testEmail    = `test_${uid()}@example.com`;
const testPassword = "TestPass@1234";

const post = (url, body, tok) =>
  fetch(url, {
    method : "POST",
    headers: { "Content-Type": "application/json", ...(tok ? { Authorization: `Bearer ${tok}` } : {}) },
    body   : JSON.stringify(body),
  });

const get = (url, tok) =>
  fetch(url, { headers: tok ? { Authorization: `Bearer ${tok}` } : {} });

before(async () => { base = await getBase(); });

describe("Auth Routes", () => {

  describe("POST /api/auth/register", () => {
    it("registers a new user and returns a token", async () => {
      const res  = await post(`${base}/api/auth/register`, { name: "Test User", email: testEmail, password: testPassword });
      const body = await res.json();
      assert.equal(res.status, 201, JSON.stringify(body));
      assert.ok(body.token);
      token = body.token;
    });

    it("rejects duplicate email → 409", async () => {
      const res = await post(`${base}/api/auth/register`, { name: "Dup", email: testEmail, password: testPassword });
      assert.equal(res.status, 409);
    });

    it("rejects missing fields → 400", async () => {
      const res = await post(`${base}/api/auth/register`, { email: "x@x.com" });
      assert.equal(res.status, 400);
    });

    it("rejects short password → 400", async () => {
      const res = await post(`${base}/api/auth/register`, { name: "X", email: `s_${uid()}@e.com`, password: "abc" });
      assert.equal(res.status, 400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns token on correct credentials", async () => {
      const res  = await post(`${base}/api/auth/login`, { email: testEmail, password: testPassword });
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
      assert.ok(body.token);
      token = body.token;
    });

    it("rejects wrong password → 401", async () => {
      const res = await post(`${base}/api/auth/login`, { email: testEmail, password: "Wrong!999" });
      assert.equal(res.status, 401);
    });

    it("rejects unknown email → 401", async () => {
      const res = await post(`${base}/api/auth/login`, { email: "nobody@nowhere.com", password: testPassword });
      assert.equal(res.status, 401);
    });

    it("rejects empty body → 400", async () => {
      const res = await post(`${base}/api/auth/login`, {});
      assert.equal(res.status, 400);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns current user when authenticated", async () => {
      const res  = await get(`${base}/api/auth/me`, token);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
      assert.ok(body.data?.user);
    });

    it("returns 401 without token", async () => {
      assert.equal((await get(`${base}/api/auth/me`)).status, 401);
    });

    it("returns 401 with invalid token", async () => {
      assert.equal((await get(`${base}/api/auth/me`, "bad-token")).status, 401);
    });
  });

  describe("POST /api/auth/change-password", () => {
    const newPwd = "NewPass@5678";

    it("rejects wrong current password → 401", async () => {
      const res = await post(`${base}/api/auth/change-password`, { currentPassword: "Wrong!999", newPassword: newPwd }, token);
      assert.equal(res.status, 401);
    });

    it("rejects short new password → 400", async () => {
      const res = await post(`${base}/api/auth/change-password`, { currentPassword: testPassword, newPassword: "abc" }, token);
      assert.equal(res.status, 400);
    });

    it("changes password and returns new token", async () => {
      const res  = await post(`${base}/api/auth/change-password`, { currentPassword: testPassword, newPassword: newPwd }, token);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
      assert.ok(body.token);
      token = body.token;
    });

    it("restores original password (suite isolation)", async () => {
      const res  = await post(`${base}/api/auth/change-password`, { currentPassword: newPwd, newPassword: testPassword }, token);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
      token = body.token;
    });
  });

  describe("POST /api/auth/logout", () => {
    it("logs out successfully", async () => {
      const res  = await post(`${base}/api/auth/logout`, {}, token);
      const body = await res.json();
      assert.equal(res.status, 200, JSON.stringify(body));
    });

    it("revoked token is rejected → 401", async () => {
      assert.equal((await get(`${base}/api/auth/me`, token)).status, 401);
    });

    it("returns 401 without token", async () => {
      assert.equal((await post(`${base}/api/auth/logout`, {})).status, 401);
    });
  });

  describe("POST /api/auth/merchant/register", () => {
    const merchantEmail = `merchant_${uid()}@shop.com`;

    it("registers a new merchant → 201", async () => {
      const res  = await post(`${base}/api/auth/merchant/register`, {
        name: "Test Shop", email: merchantEmail, password: testPassword,
        category: "E-commerce", country: "India",
      });
      const body = await res.json();
      assert.equal(res.status, 201, JSON.stringify(body));
      assert.ok(body.data?.merchant);
    });

    it("rejects duplicate merchant email → 409", async () => {
      const res = await post(`${base}/api/auth/merchant/register`, {
        name: "Dup", email: merchantEmail, password: testPassword, category: "E-commerce",
      });
      assert.equal(res.status, 409);
    });

    it("rejects missing category → 400", async () => {
      const res = await post(`${base}/api/auth/merchant/register`, {
        name: "No Cat", email: `nc_${uid()}@shop.com`, password: testPassword,
      });
      assert.equal(res.status, 400);
    });
  });
});
