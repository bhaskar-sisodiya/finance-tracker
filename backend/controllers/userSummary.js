// controllers/userSummary.js
import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth },
    });

    const totalDebit = Number(expenses
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0).toFixed(2));

    const totalCredit = Number(expenses
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0).toFixed(2));

    const remainingBalance = Number((user.budget + totalCredit - totalDebit).toFixed(2));

    // Real-time Savings/Deficit Logic
    // We calculate "live" projected values based on current month's performance
    let projectedSavings = user.savings;
    let projectedDeficit = user.deficit;

    const currentMonthPerformance = Number((user.budget + totalCredit - totalDebit).toFixed(2));

    if (currentMonthPerformance >= 0) {
      // If performing well this month, first offset any existing deficit
      const offset = Number(Math.min(currentMonthPerformance, projectedDeficit).toFixed(2));
      projectedDeficit = Number((projectedDeficit - offset).toFixed(2));
      // Any remaining surplus goes to projected savings
      projectedSavings = Number((projectedSavings + (currentMonthPerformance - offset)).toFixed(2));
    } else {
      // If overspent this month, first draw from existing savings
      const loss = Math.abs(currentMonthPerformance);
      const draw = Number(Math.min(loss, projectedSavings).toFixed(2));
      projectedSavings = Number((projectedSavings - draw).toFixed(2));
      // Any remaining loss adds to projected deficit
      projectedDeficit = Number((projectedDeficit + (loss - draw)).toFixed(2));
    }

    res.json({
      totalBalance: user.budget,
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
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Detect Timeline Start (Earliest Expense)
    const earliestExpense = await Expense.findOne({ user: userId }).sort({ date: 1 });
    const now = new Date();
    
    // If no expenses, just reset to 0
    if (!earliestExpense) {
      user.savings = 0;
      user.deficit = 0;
      await user.save();
      return res.json({ message: "No expenses found. Reset to zero.", savings: 0, deficit: 0 });
    }

    const startDate = new Date(earliestExpense.date);
    
    // 2. Fetch all historical summaries to get past budgets
    const MonthlySummary = (await import("../models/MonthlySummary.js")).default;
    const summaries = await MonthlySummary.find({ user: userId });
    const summaryMap = {};
    summaries.forEach(s => {
      summaryMap[s.month] = s.totalBalance;
    });

    // 3. Iterate through months to calculate total lifetime budget
    let totalLifetimeBudget = 0;
    let tempDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const monthsCalculated = [];

    while (tempDate <= now) {
      const monthLabel = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;
      
      // Use historical budget if exists, otherwise current budget
      const monthlyBudget = summaryMap[monthLabel] !== undefined ? summaryMap[monthLabel] : user.budget;
      totalLifetimeBudget += monthlyBudget;
      
      monthsCalculated.push(monthLabel);
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    // 4. Aggregate all transactions
    const expenses = await Expense.find({ user: userId });
    const totalDebit = Number(expenses
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0).toFixed(2));

    const totalCredit = Number(expenses
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0).toFixed(2));

    const lifetimePerformance = Number((totalLifetimeBudget + totalCredit - totalDebit).toFixed(2));

    // 5. Reset savings/deficit
    if (lifetimePerformance >= 0) {
      user.savings = lifetimePerformance;
      user.deficit = 0;
    } else {
      user.savings = 0;
      user.deficit = Math.abs(lifetimePerformance);
    }

    await user.save();

    // 6. Sync: Mark all transactions as counted
    await Expense.updateMany({ user: userId }, { $set: { counted: true } });

    res.json({
      message: "Lifetime summary recalculated with historical accuracy",
      savings: user.savings,
      deficit: user.deficit,
      monthsAnalyzed: monthsCalculated.length,
      timelineStart: monthsCalculated[0]
    });
  } catch (err) {
    console.error("Recalculate error:", err);
    res.status(500).json({ message: "Failed to recalculate summary" });
  }
};