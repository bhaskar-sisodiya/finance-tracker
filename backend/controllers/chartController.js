// detailsController.js
import Expense from "../models/Expense.js";
import mongoose from "mongoose";
import MonthlySummary from "../models/MonthlySummary.js";

export const getMonthlyTrend = async (req, res) => {
  try {

    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    if (isNaN(year) || isNaN(month)) {
      return res.status(400).json({ error: "Invalid year or month" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const trend = await Expense.aggregate([
      {
        $match: {
          user: userId,
          type: "debit",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    // console.log(trend);
    res.json(trend);
  } catch (error) {
    console.error("Error in getMonthlyTrend:", error.message);
    res.status(500).json({ error: "Failed to fetch monthly trend" });
  }
};

export const getYearlySummary = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
    const year = parseInt(req.params.year);

    if (isNaN(year)) {
      return res.status(400).json({ error: "Invalid year format" });
    }

    const startMonth = `${year}-01`;
    const endMonth = `${year}-12`;

    // 1. Fetch historical summaries from DB
    const summaries = await MonthlySummary.find({
      user: userId,
      month: { $gte: startMonth, $lte: endMonth },
    });

    // 2. Fetch ALL live (uncounted) expenses for this year to ensure real-time accuracy
    // This catches months that haven't been snapshotted yet (like the current month or late entries)
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);

    const liveExpenses = await Expense.find({
      user: userId,
      date: { $gte: yearStart, $lte: yearEnd },
      counted: false
    });

    // Group live expenses by month index (0-11)
    const liveGrouped = liveExpenses.reduce((acc, exp) => {
      const m = new Date(exp.date).getMonth();
      if (!acc[m]) acc[m] = { debit: 0, credit: 0 };
      if (exp.type === "debit") acc[m].debit += exp.amount;
      else acc[m].credit += exp.amount;
      return acc;
    }, {});

    // 3. Fetch budgets for this year to ensure accuracy in the chart
    const Budget = (await import("../models/Budget.js")).default;
    const yearBudgets = await Budget.find({
      user: userId,
      month: { $gte: startMonth, $lte: endMonth },
    });

    // 4. Initialize all 12 months by merging DB summaries + Live uncounted data + Budgets
    const now = new Date();
    const isCurrentYear = now.getFullYear() === year;

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthString = `${year}-${String(i + 1).padStart(2, "0")}`;
      const entry = summaries.find((s) => s.month === monthString);
      const budgetEntry = yearBudgets.find((b) => b.month === monthString);

      let debit = Number((entry?.totalDebit || 0).toFixed(2));
      let credit = Number((entry?.totalCredit || 0).toFixed(2));

      // Source budget from Budget collection (if set) else fallback to summary snapshot
      let budget = budgetEntry?.amount || entry?.totalBalance || 0;

      // Add live data for this month if it exists
      if (liveGrouped[i]) {
        debit = Number((debit + liveGrouped[i].debit).toFixed(2));
        credit = Number((credit + liveGrouped[i].credit).toFixed(2));
      }

      return {
        month: i + 1,
        debit,
        credit,
        budget,
      };
    });

    res.json(monthlyData);
  } catch (err) {
    console.error("Bar chart summary error:", err.message);
    res.status(500).json({ error: "Failed to fetch yearly summary" });
  }
};
