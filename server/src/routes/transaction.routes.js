import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);

export default router;