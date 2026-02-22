// detailsController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password, profilePic, budget } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (profilePic) updates.profilePic = profilePic;
    if (budget) updates.budget = budget;

    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    // If budget updated, sync it with the current month's Budget and MonthlySummary
    if (budget !== undefined) {
      const Budget = (await import("../models/Budget.js")).default;
      const MonthlySummary = (await import("../models/MonthlySummary.js")).default;
      const now = new Date();
      const monthLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Update Budget collection
      await Budget.findOneAndUpdate(
        { user: userId, month: monthLabel },
        { $set: { amount: Number(budget) } },
        { upsert: true }
      );

      // Sink into MonthlySummary too for consistency in history
      await MonthlySummary.findOneAndUpdate(
        { user: userId, month: monthLabel },
        { $set: { totalBalance: Number(budget) } }
      );
    }

    res.status(200).json({
      message: "Profile updated",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        profilePic: updatedUser.profilePic,
        budget: Number(updatedUser.budget),
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const updateMonthlyBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.params; // format: YYYY-MM
    const { amount } = req.body;

    if (!month || amount === undefined) {
      return res.status(400).json({ error: "Month and amount are required" });
    }

    const Budget = (await import("../models/Budget.js")).default;
    const MonthlySummary = (await import("../models/MonthlySummary.js")).default;

    // 1. Update/Create Budget record
    await Budget.findOneAndUpdate(
      { user: userId, month },
      { $set: { amount: Number(amount) } },
      { upsert: true }
    );

    // 2. Sync with MonthlySummary record (if it exists)
    await MonthlySummary.findOneAndUpdate(
      { user: userId, month },
      { $set: { totalBalance: Number(amount) } }
    );

    res.json({ message: `Budget for ${month} updated to ${amount}` });
  } catch (error) {
    console.error("Monthly budget update error:", error.message);
    res.status(500).json({ error: "Failed to update month budget" });
  }
};