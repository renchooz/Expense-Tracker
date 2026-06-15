import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getDashboardSummary,
  getRecentTransactions,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/summary", protectRoute, getDashboardSummary);
router.get("/recent", protectRoute, getRecentTransactions);

export default router;