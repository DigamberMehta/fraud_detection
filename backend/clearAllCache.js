import { getRedisClient } from "./config/redis.js";

const clearAllRedisCache = async () => {
  const redis = getRedisClient();

  try {
    console.log("Clearing all Redis cache...");

    const result = await redis.flushdb();
    console.log(`Successfully cleared all Redis data: ${result}`);

    process.exit(0);
  } catch (err) {
    console.error("Error clearing Redis cache:", err);
    process.exit(1);
  }
};

clearAllRedisCache();
