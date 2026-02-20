import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import { getRedisClient } from "./config/redis.js";
import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import merchantRoutes from "./routes/merchantRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import fraudRoutes from "./routes/fraudRoutes.js";

const app = express();

// ── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// ── HTTP Parameter Pollution Protection ──────────────────────────────────────
app.use(hpp());

// ── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// ── Global Rate Limit ────────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ── Connect DB & Redis ───────────────────────────────────────────────────────
connectDB();
getRedisClient();

// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  const redis = getRedisClient();
  let redisStatus = "disconnected";
  try {
    await redis.ping();
    redisStatus = "connected";
  } catch {
    redisStatus = "error";
  }

  res.status(200).json({
    success: true,
    message: "FraudShield API is running.",
    uptime: `${Math.round(process.uptime())}s`,
    environment: process.env.NODE_ENV,
    services: {
      mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      redis: redisStatus,
      gemini: process.env.GEMINI_API_KEY ? "configured" : "not_configured",
    },
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/merchants", merchantRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/fraud", fraudRoutes);

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server (only when run directly, not when imported by tests) ─────────
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (isMain || process.env.NODE_ENV !== "test") {
  const PORT   = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        const redis = getRedisClient();
        await redis.quit();
        console.log("Redis disconnected.");
      } catch {}
      await mongoose.connection.close();
      console.log("MongoDB disconnected.");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));
}

export default app;

