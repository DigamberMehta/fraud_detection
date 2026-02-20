import { getRedisClient, KEYS } from "../config/redis.js";

const cacheResponse = (ttlSeconds = 60, keyFn) => async (req, res, next) => {
  if (req.method !== "GET") return next();

  const redis = getRedisClient();
  const cacheKey = KEYS.cache(keyFn ? keyFn(req) : `${req.originalUrl}:${req.user?._id || "anon"}`);

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));
  } catch {
    // Redis unavailable — proceed without cache
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200 && body?.success) {
      redis.setex(cacheKey, ttlSeconds, JSON.stringify(body)).catch(() => {});
    }
    return originalJson(body);
  };

  next();
};

const invalidateCache = async (pattern) => {
  const redis = getRedisClient();
  try {
    const keys = await redis.keys(KEYS.cache(pattern));
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    // Non-critical — cache will expire naturally
  }
};

export { cacheResponse, invalidateCache };
