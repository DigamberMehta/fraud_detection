import { Router } from "express";
import { createTransaction, getMyTransactions, getAllTransactions, getTransactionById, getStats } from "../controllers/transactionController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { transactionLimiter, adminLimiter } from "../middleware/rateLimiter.js";
import { cacheResponse } from "../middleware/cache.js";

const router = Router();

router.post("/", protect, transactionLimiter, createTransaction);
router.get("/my", protect, cacheResponse(30), getMyTransactions);
router.get("/stats", protect, adminOnly, cacheResponse(60), getStats);
router.get("/all", protect, adminOnly, adminLimiter, getAllTransactions);
router.get("/:id", protect, getTransactionById);

export default router;
