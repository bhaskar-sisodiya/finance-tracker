// routes/summaryRoutes.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { getMonthlySummary, recalculateLifetimeSummary } from "../controllers/userSummary.js";
import protect from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/userSummary.js";
import { updateUserDetails, updateMonthlyBudget } from "../controllers/detailsController.js";

const router = express.Router();

router.get("/summary", protect, getMonthlySummary);
router.get("/me", protect, getCurrentUser);
router.put("/update", protect, updateUserDetails);
router.put("/budget/:month", protect, updateMonthlyBudget);
router.post("/recalculate", protect, recalculateLifetimeSummary);

export default router;