/**
 * test/setup.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Singleton server helper.
 *
 * Node's --test runner loads all *.test.js files in ONE process.
 * getBase() starts the server the first time and returns the cached URL on
 * every subsequent call.  The server stays alive for the whole test run and
 * is closed at process exit, so individual test files MUST NOT call any
 * teardown — they just call getBase() and run.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import "dotenv/config";
import app from "../server.js";

let server = null;
let base   = null;

/** Start the server once and cache the base URL. */
export const getBase = () =>
  new Promise((resolve, reject) => {
    if (base) return resolve(base);

    server = app.listen(0, (err) => {
      if (err) return reject(err);
      base = `http://localhost:${server.address().port}`;
      resolve(base);
    });
  });

/** Close the server — called at process exit so nothing hangs. */
const shutdown = () => {
  if (server) {
    server.closeAllConnections?.();   // Node 18.2+
    server.close();
    server = null;
  }
};

process.on("exit",    shutdown);
process.on("SIGINT",  () => { shutdown(); process.exit(0); });
process.on("SIGTERM", () => { shutdown(); process.exit(0); });
