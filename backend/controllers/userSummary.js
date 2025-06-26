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

    const totalDebit = expenses
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalCredit = expenses
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0);

    const remainingBalance = user.budget + totalCredit - totalDebit;

    res.json({
      totalBalance: user.budget,
      remainingBalance,
      savings: user.savings,
      deficit: user.deficit,
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