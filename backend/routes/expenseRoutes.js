import express from "express";
import protect from "../middleware/authMiddleware.js";
import Expense from "../models/Expense.js";
import { getMonthlyTrend, getYearlySummary } from "../controllers/chartController.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { date, domain, title, description, amount, type } = req.body;

    const expense = new Expense({
      date: new Date(date),
      domain,
      title,
      description,
      amount,
      type,
      user: req.user.id, // Auto-linking to the logged-in user
    });

    await expense.save();

    res.status(201).json({ message: "Expense saved", expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/current-month", protect, async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  try {
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).select("date title domain amount type")
    .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch current month expenses." });
  }
});

router.get("/daily-trend/:year/:month", protect, getMonthlyTrend);
router.get("/yearly-summary/:year", protect, getYearlySummary);

export default router;
