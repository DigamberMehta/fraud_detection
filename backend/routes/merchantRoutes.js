import { Router } from "express";
import { getAllMerchants, getMerchantById, updateRiskScore, deactivateMerchant, getHighRiskMerchants } from "../controllers/merchantController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { adminLimiter } from "../middleware/rateLimiter.js";
import { cacheResponse } from "../middleware/cache.js";

const router = Router();

router.get("/", protect, adminOnly, cacheResponse(60), getAllMerchants);
router.get("/high-risk", protect, adminOnly, cacheResponse(30), getHighRiskMerchants);
router.get("/:id", protect, cacheResponse(60), getMerchantById);
router.patch("/:id/risk-score", protect, adminOnly, adminLimiter, updateRiskScore);
router.patch("/:id/deactivate", protect, adminOnly, adminLimiter, deactivateMerchant);

export default router;
