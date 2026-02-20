import Redis from "ioredis";

let redisClient = null;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 5) {
        console.error("Redis: max retries reached, giving up.");
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    enableReadyCheck: true,
    lazyConnect: false,
  });

  redisClient.on("connect", () => console.log("Redis: connected"));
  redisClient.on("ready", () => console.log("Redis: ready"));
  redisClient.on("error", (err) => console.error("Redis error:", err.message));

  return redisClient;
};

// Namespaced key helpers to avoid collisions
const KEYS = {
  session: (userId) => `session:${userId}`,
  blacklist: (token) => `bl:${token}`,
  rateLimit: (ip, route) => `rl:${ip}:${route}`,
  cache: (key) => `cache:${key}`,
  userProfile: (userId) => `user:${userId}`,
  merchantProfile: (merchantId) => `merchant:${merchantId}`,
  txnStats: () => "stats:txn",
  fraudStats: () => "stats:fraud",
};

export { getRedisClient, KEYS };
