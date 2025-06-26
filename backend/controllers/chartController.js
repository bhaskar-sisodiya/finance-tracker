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

    // Fetch summaries for that user and year
    const summaries = await MonthlySummary.find({
      user: userId,
      month: { $gte: startMonth, $lte: endMonth },
    });

    // Initialize all 12 months to 0
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthString = `${year}-${String(i + 1).padStart(2, "0")}`;
      const entry = summaries.find((s) => s.month === monthString);
      return {
        month: i + 1,
        debit: entry?.totalDebit || 0,
        credit: entry?.totalCredit || 0,
      };
    });

    res.json(monthlyData);
  } catch (err) {
    console.error("Bar chart summary error:", err.message);
    res.status(500).json({ error: "Failed to fetch yearly summary" });
  }
};
