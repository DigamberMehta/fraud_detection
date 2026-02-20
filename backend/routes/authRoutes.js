import { Router } from "express";
import { register, login, logout, merchantRegister, getMe, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", protect, logout);
router.post("/merchant/register", authLimiter, merchantRegister);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

export default router;
