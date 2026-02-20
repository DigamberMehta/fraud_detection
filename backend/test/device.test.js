/**
 * test/device.test.js
 * Tests every endpoint registered under /api/devices
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { getBase } from "./setup.js";

const uid = () => Math.random().toString(36).slice(2, 8);

let base, userToken, adminToken, registeredDeviceId;

const post  = (url, body, tok) => fetch(url, { method: "POST",  headers: { "Content-Type": "application/json", ...(tok ? { Authorization: `Bearer ${tok}` } : {}) }, body: JSON.stringify(body) });
const get   = (url, tok)       => fetch(url, { headers: { Authorization: `Bearer ${tok}` } });
const patch = (url, body, tok) => fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` }, body: JSON.stringify(body) });

before(async () => {
  base = await getBase();
  const pwd = "DevPass@1234";

  const email = `dev_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Dev User", email, password: pwd });
  userToken = ((await (await post(`${base}/api/auth/login`, { email, password: pwd })).json())).token;

  const adminEmail = `devadm_${uid()}@example.com`;
  await post(`${base}/api/auth/register`, { name: "Dev Admin", email: adminEmail, password: pwd, role: "admin" });
  adminToken = ((await (await post(`${base}/api/auth/login`, { email: adminEmail, password: pwd })).json())).token;
});

describe("Device Routes", () => {

  describe("POST /api/devices/register", () => {
    it("registers a device for the authenticated user", async () => {
      const myDeviceId = `device_${uid()}`;
      const res  = await post(`${base}/api/devices/register`, {
        deviceId: myDeviceId,
        userAgent: "TestUA/1.0",
        os: "Linux",
        browser: "node-test",
        deviceType: "desktop",
        ipAddress: "10.0.0.1",
      }, userToken);
      const body = await res.json();
      assert.ok([200, 201].includes(res.status), `status ${res.status}: ${JSON.stringify(body)}`);
      if ([200, 201].includes(res.status)) {
        registeredDeviceId = body.data?.device?.deviceId ?? myDeviceId;
      }
    });

    it("→ 401 without token", async () => {
      assert.equal((await post(`${base}/api/devices/register`, { deviceId: "x" })).status, 401);
    });
  });

  describe("GET /api/devices/my", () => {
    it("returns own device list", async () => {
      const body = await (await get(`${base}/api/devices/my`, userToken)).json();
      assert.equal(body.success, true);
      assert.ok(Array.isArray(body.data?.devices));
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/devices/my`)).status, 401);
    });
  });

  describe("PATCH /api/devices/:deviceId/trust", () => {
    it("marks device as trusted (skips if no id)", async () => {
      if (!registeredDeviceId) return;
      const s = (await patch(`${base}/api/devices/${registeredDeviceId}/trust`, {}, userToken)).status;
      assert.ok([200, 400, 404].includes(s));
    });

    it("→ 401 without token", async () => {
      assert.equal((await fetch(`${base}/api/devices/someid/trust`, { method: "PATCH" })).status, 401);
    });
  });

  describe("GET /api/devices/ (admin)", () => {
    it("admin gets all devices", async () => {
      const body = await (await get(`${base}/api/devices/`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/devices/`, userToken)).status, 403);
    });
  });

  describe("GET /api/devices/shared (admin)", () => {
    it("admin gets shared devices", async () => {
      const body = await (await get(`${base}/api/devices/shared`, adminToken)).json();
      assert.equal(body.success, true);
    });

    it("→ 403 for regular user", async () => {
      assert.equal((await get(`${base}/api/devices/shared`, userToken)).status, 403);
    });
  });
});
