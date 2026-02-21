import express from "express";
import protect from "../middleware/authMiddleware.js";
import Expense from "../models/Expense.js";
import {
  getMonthlyTrend,
  getYearlySummary,
} from "../controllers/chartController.js";

const router = express.Router();

// ── POST / — add a new expense ───────────────────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { date, domain, title, description, amount, type } = req.body;
    const roundedAmount = Number(Number(amount).toFixed(2));
    const expense = new Expense({
      ...(date && { date: new Date(date) }),
      domain, title, description, amount: roundedAmount, type,
      user: req.user.id,
    });
    await expense.save();
    res.status(201).json({ message: "Expense saved", expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /current-month ───────────────────────────────────────────────────────
router.get("/current-month", protect, async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  try {
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    })
      .select("date title domain amount type")
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch current month expenses." });
  }
});

// ── GET / — all expenses with optional filters ───────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const { search, type, domain, from, to } = req.query;
    const filter = { user: req.user.id };

    if (type && type !== "all") filter.type = type;
    if (domain && domain !== "all") filter.domain = domain;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to + "T23:59:59");
    }
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /bulk — delete multiple expenses ──────────────────────────────────
// Must come before /:id to avoid "bulk" being treated as an id
router.delete("/bulk", protect, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "No IDs provided." });

    const result = await Expense.deleteMany({
      _id: { $in: ids },
      user: req.user.id, // safety: only delete user's own records
    });
    res.json({ message: `${result.deletedCount} expense(s) deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /:id — update a single expense ──────────────────────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    const { date, domain, title, description, amount, type } = req.body;
    const updateData = { ...(date && { date: new Date(date) }), domain, title, description, type };
    if (amount !== undefined) {
      updateData.amount = Number(Number(amount).toFixed(2));
    }
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: "Expense not found." });
    res.json({ message: "Expense updated", expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /:id — delete a single expense ───────────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) return res.status(404).json({ error: "Expense not found." });
    res.json({ message: "Expense deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/daily-trend/:year/:month", protect, getMonthlyTrend);
router.get("/yearly-summary/:year", protect, getYearlySummary);

export default router;
