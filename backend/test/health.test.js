/**
 * test/health.test.js  –  GET /api/health
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { getBase } from "./setup.js";

let base;
before(async () => { base = await getBase(); });

describe("GET /api/health", () => {
  it("returns 200 with service status fields", async () => {
    const res  = await fetch(`${base}/api/health`);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.ok(body.uptime,   "uptime should be present");
    assert.ok(body.services, "services object should be present");
    assert.ok(["connected","disconnected"].includes(body.services.mongodb));
    assert.ok(["connected","disconnected","error"].includes(body.services.redis));
    assert.ok(["configured","not_configured"].includes(body.services.gemini));
  });
});
