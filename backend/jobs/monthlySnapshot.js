import Expense from "../models/Expense.js";
import User from "../models/User.js";
import MonthlySummary from "../models/MonthlySummary.js";

export const generateUserSnapshot = async (userId) => {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthLabel = `${previousMonth.getFullYear()}-${String(
    previousMonth.getMonth() + 1
  ).padStart(2, "0")}`;

  const user = await User.findById(userId);
  if (!user) return;

  const start = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
  const end = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0, 23, 59, 59, 999);

  const uncountedExpenses = await Expense.find({
    user: userId,
    counted: false,
    date: { $gte: start, $lte: end },
  });

  if (uncountedExpenses.length === 0) {
    console.log(`🔹 No new expenses for ${user.email} in ${monthLabel}, skipping`);
    return;
  }

  const totalDebit = uncountedExpenses
    .filter((e) => e.type === "debit")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCredit = uncountedExpenses
    .filter((e) => e.type === "credit")
    .reduce((sum, e) => sum + e.amount, 0);

  const remaining = totalCredit - totalDebit;

  if (remaining > 0) {
    const offset = Math.min(remaining, user.deficit);
    user.deficit -= offset;
    user.savings += remaining - offset;
  } else if (remaining < 0) {
    const overspent = Math.abs(remaining);
    const offset = Math.min(overspent, user.savings);
    user.savings -= offset;
    user.deficit += overspent - offset;
  }

  await user.save();

  await MonthlySummary.findOneAndUpdate(
    { user: userId, month: monthLabel },
    {
      $inc: { totalDebit, totalCredit },
      $set: { totalBalance: user.budget, deficit: user.deficit },
    },
    { upsert: true, new: true }
  );

  await Expense.updateMany(
    { _id: { $in: uncountedExpenses.map((e) => e._id) } },
    { $set: { counted: true } }
  );

  console.log(`📌 Snapshot updated for ${user.email} on login/register (${monthLabel})`);
};