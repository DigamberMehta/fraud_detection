import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "../config/redis.js";

// In test mode, skip all rate limiting so tests never get 429d.
const IS_TEST = process.env.NODE_ENV === "test";

const passThrough = (_req, _res, next) => next();

const createLimiter = ({ prefix, windowMs, max, message }) => {
  if (IS_TEST) return passThrough;
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
    store: new RedisStore({
      sendCommand: (...args) => getRedisClient().call(...args),
      prefix: `rl:${prefix}:`,
    }),
  });
};

const authLimiter = createLimiter({
  prefix: "auth",
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login/register attempts. Try again in 15 minutes.",
});

const transactionLimiter = createLimiter({
  prefix: "txn",
  windowMs: 60 * 1000,
  max: 30,
  message: "Transaction rate limit exceeded. Slow down.",
});

const apiLimiter = createLimiter({
  prefix: "api",
  windowMs: 60 * 1000,
  max: 100,
  message: "API rate limit exceeded. Try again shortly.",
});

const adminLimiter = createLimiter({
  prefix: "admin",
  windowMs: 60 * 1000,
  max: 20,
  message: "Admin operation rate limit exceeded.",
});

export { authLimiter, transactionLimiter, apiLimiter, adminLimiter, createLimiter };
