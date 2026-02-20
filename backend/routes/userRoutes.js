import { Router } from "express";
import { getAllUsers, getUserById, lockUser, unlockUser, getMyProfile, updateMyProfile, updateBalance } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { apiLimiter, adminLimiter } from "../middleware/rateLimiter.js";
import { cacheResponse } from "../middleware/cache.js";

const router = Router();

router.get("/me/profile", protect, cacheResponse(60), getMyProfile);
router.patch("/me/profile", protect, apiLimiter, updateMyProfile);

router.get("/", protect, adminOnly, cacheResponse(30), getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.patch("/:id/lock", protect, adminOnly, adminLimiter, lockUser);
router.patch("/:id/unlock", protect, adminOnly, adminLimiter, unlockUser);
router.patch("/:id/balance", protect, adminOnly, adminLimiter, updateBalance);

export default router;
