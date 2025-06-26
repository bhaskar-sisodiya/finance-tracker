// jobs/monthlySnapshot.js
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import MonthlySummary from "../models/MonthlySummary.js";

export const generateMonthlySnapshots = async () => {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthLabel = `${previousMonth.getFullYear()}-${String(
    previousMonth.getMonth() + 1
  ).padStart(2, "0")}`;

  const users = await User.find();

  for (const user of users) {

    const start = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth(),
      1
    );
    const end = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth() + 1,
      0
    );

    const expenses = await Expense.find({
      user: user._id,
      date: { $gte: start, $lte: end },
    });

    const totalDebit = expenses
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalCredit = expenses
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0);

    const remaining = user.budget + totalCredit - totalDebit;

    if (remaining > 0) {
      const offset = Math.min(remaining, user.deficit);
      user.deficit -= offset;
      const netSurplus = remaining - offset;
      user.savings += netSurplus;
    } else if (remaining < 0) {
      const overspent = Math.abs(remaining);
      const offset = Math.min(overspent, user.savings);
      user.savings -= offset;
      const netDeficit = overspent - offset;
      user.deficit += netDeficit;
    }

    await user.save();

    await MonthlySummary.findOneAndUpdate(
      { user: user._id, month: monthLabel },
      {
        $set: {
          totalBalance: user.budget,
          totalDebit,
          totalCredit,
          deficit: user.deficit,
        },
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Snapshot created for ${user.email} (${monthLabel})`);
  }
};
