import { Router } from "express";
import { getAllFraudLogs, getFraudLogById, reviewFraudLog, getFraudStats } from "../controllers/fraudController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { adminLimiter } from "../middleware/rateLimiter.js";
import { cacheResponse } from "../middleware/cache.js";

const router = Router();

router.get("/", protect, adminOnly, adminLimiter, getAllFraudLogs);
router.get("/stats", protect, adminOnly, cacheResponse(60), getFraudStats);
router.get("/:id", protect, adminOnly, getFraudLogById);
router.patch("/:id/review", protect, adminOnly, adminLimiter, reviewFraudLog);

export default router;
