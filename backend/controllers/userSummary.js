// controllers/userSummary.js
import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const currentMonthLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Fetch specific budget for this month
    const Budget = (await import("../models/Budget.js")).default;
    const budgetRecord = await Budget.findOne({ user: userId, month: currentMonthLabel });
    const currentBudget = budgetRecord ? budgetRecord.amount : user.budget;

    // 2. Fetch current month expenses for "Remaining Balance" calculation
    const currentExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfCurrentMonth },
    });

    const currentDebit = Number(currentExpenses
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0).toFixed(2));

    const currentCredit = Number(currentExpenses
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0).toFixed(2));

    const remainingBalance = Number((currentBudget + currentCredit - currentDebit).toFixed(2));

    // 3. Ground Truth Projection: Include ALL uncounted expenses (including backdated ones)
    // This ensures the dashboard "Savings" bubble matches the profile's ultimate state.
    const allUncounted = await Expense.find({ user: userId, counted: false });

    const uncountedDebit = allUncounted.filter(e => e.type === "debit").reduce((sum, e) => sum + e.amount, 0);
    const uncountedCredit = allUncounted.filter(e => e.type === "credit").reduce((sum, e) => sum + e.amount, 0);

    const uncountedPerformance = Number((uncountedCredit - uncountedDebit).toFixed(2));

    let projectedSavings = user.savings;
    let projectedDeficit = user.deficit;

    if (uncountedPerformance >= 0) {
      const offset = Number(Math.min(uncountedPerformance, projectedDeficit).toFixed(2));
      projectedDeficit = Number((projectedDeficit - offset).toFixed(2));
      projectedSavings = Number((projectedSavings + (uncountedPerformance - offset)).toFixed(2));
    } else {
      const loss = Math.abs(uncountedPerformance);
      const draw = Number(Math.min(loss, projectedSavings).toFixed(2));
      projectedSavings = Number((projectedSavings - draw).toFixed(2));
      projectedDeficit = Number((projectedDeficit + (loss - draw)).toFixed(2));
    }

    res.json({
      totalBalance: currentBudget,
      remainingBalance,
      savings: projectedSavings,
      deficit: projectedDeficit,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const recalculateLifetimeSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rebuildAllSummaries } = await import("../jobs/monthlySnapshot.js");

    await rebuildAllSummaries(userId);

    const user = await User.findById(userId).select("savings deficit");

    res.json({
      message: "Deep Recalculation Complete. All historical summaries and lifetime stats are now perfectly synchronized.",
      savings: user.savings,
      deficit: user.deficit
    });
  } catch (err) {
    console.error("Deep Recalculate error:", err);
    res.status(500).json({ message: "Failed to perform deep recalculation" });
  }
};
