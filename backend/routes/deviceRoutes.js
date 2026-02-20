import { Router } from "express";
import { registerDevice, getAllDevices, getSharedDevices, getMyDevices, trustDevice } from "../controllers/deviceController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { apiLimiter, adminLimiter } from "../middleware/rateLimiter.js";
import { cacheResponse } from "../middleware/cache.js";

const router = Router();

router.post("/register", protect, apiLimiter, registerDevice);
router.get("/my", protect, cacheResponse(60), getMyDevices);
router.patch("/:deviceId/trust", protect, apiLimiter, trustDevice);

router.get("/", protect, adminOnly, cacheResponse(30), getAllDevices);
router.get("/shared", protect, adminOnly, cacheResponse(30), getSharedDevices);

export default router;
