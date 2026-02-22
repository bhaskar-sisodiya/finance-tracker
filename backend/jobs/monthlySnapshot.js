// monthlySnapshot.js
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import MonthlySummary from "../models/MonthlySummary.js";

/**
 * Ensures user.savings and user.deficit match the sum of all MonthlySummary records.
 * This is the ultimate "Ground Truth" fix.
 */
export const syncUserStatsWithSummaries = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const summaries = await MonthlySummary.find({ user: userId }).sort({ month: 1 });

  // Calculate total historical performance
  let totalSavings = 0;
  let totalDeficit = 0;

  for (const s of summaries) {
    // Ground Truth: Remaining = (Monthly Budget + Credits) - Debits
    const remaining = Number((s.totalBalance + s.totalCredit - s.totalDebit).toFixed(2));
    if (remaining > 0) {
      const offset = Number(Math.min(remaining, totalDeficit).toFixed(2));
      totalDeficit = Number((totalDeficit - offset).toFixed(2));
      totalSavings = Number((totalSavings + (remaining - offset)).toFixed(2));
    } else if (remaining < 0) {
      const overspent = Math.abs(remaining);
      const offset = Number(Math.min(overspent, totalSavings).toFixed(2));
      totalSavings = Number((totalSavings - offset).toFixed(2));
      totalDeficit = Number((totalDeficit + (overspent - offset)).toFixed(2));
    }
  }

  user.savings = Number(totalSavings.toFixed(2));
  user.deficit = Number(totalDeficit.toFixed(2));
  await user.save();
  console.log(`🔄 Synced lifetime stats for ${user.email}: Savings=₹${user.savings}, Deficit=₹${user.deficit}`);
};

export const generateUserSnapshot = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  // 1. Identify WHICH months have new (uncounted) expenses
  const uncountedExpenses = await Expense.find({ user: userId, counted: false });

  if (uncountedExpenses.length === 0) {
    console.log(`🔹 No new expenses for ${user.email}, skipping snapshot`);
    return;
  }

  const affectedMonths = [...new Set(uncountedExpenses.map(exp => {
    const d = new Date(exp.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }))].sort();

  console.log(`🔹 Snapshotting ${user.email}: Processing ${affectedMonths.length} month(s) (${affectedMonths.join(", ")})`);

  for (const monthLabel of affectedMonths) {
    // 2. To be idempotent and handle edits/deletes, we re-aggregate the WHOLE month
    const [year, month] = monthLabel.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const monthExpenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lte: end }
    });

    const totals = monthExpenses.reduce((acc, exp) => {
      if (exp.type === "debit") acc.debit += exp.amount;
      else acc.credit += exp.amount;
      return acc;
    }, { debit: 0, credit: 0 });

    const totalDebit = Number(totals.debit.toFixed(2));
    const totalCredit = Number(totals.credit.toFixed(2));

    // 3. Fetch specific budget
    const Budget = (await import("../models/Budget.js")).default;
    let budgetRecord = await Budget.findOne({ user: userId, month: monthLabel });
    if (!budgetRecord) {
      budgetRecord = await Budget.create({ user: userId, month: monthLabel, amount: user.budget });
    }

    // 4. Update the summary (Set absolute values instead of incrementing)
    await MonthlySummary.findOneAndUpdate(
      { user: userId, month: monthLabel },
      {
        $set: {
          totalDebit,
          totalCredit,
          totalBalance: budgetRecord.amount
        },
      },
      { upsert: true }
    );

    // 5. Mark these expenses as counted
    await Expense.updateMany(
      { user: userId, date: { $gte: start, $lte: end }, counted: false },
      { $set: { counted: true } }
    );

    console.log(`  ✅ ${monthLabel}: Re-synchronized and marked expenses as counted.`);
  }

  // 6. After updating summaries, re-sync user lifetime stats to fix any drift
  await syncUserStatsWithSummaries(userId);
};

/**
 * Force a recalculation of a specific month and re-sync user stats.
 * Useful after deletions or manual edits to old records.
 */
export const forceSyncMonth = async (userId, monthLabel) => {
  const [year, month] = monthLabel.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const monthExpenses = await Expense.find({
    user: userId,
    date: { $gte: start, $lte: end }
  });

  const totals = monthExpenses.reduce((acc, exp) => {
    if (exp.type === "debit") acc.debit += exp.amount;
    else acc.credit += exp.amount;
    return acc;
  }, { debit: 0, credit: 0 });

  const totalDebit = Number(totals.debit.toFixed(2));
  const totalCredit = Number(totals.credit.toFixed(2));

  const User = (await import("../models/User.js")).default;
  const user = await User.findById(userId);
  const Budget = (await import("../models/Budget.js")).default;
  let budgetRecord = await Budget.findOne({ user: userId, month: monthLabel });
  if (!budgetRecord) {
    budgetRecord = await Budget.create({ user: userId, month: monthLabel, amount: user.budget });
  }

  const MonthlySummary = (await import("../models/MonthlySummary.js")).default;
  await MonthlySummary.findOneAndUpdate(
    { user: userId, month: monthLabel },
    {
      $set: {
        totalDebit,
        totalCredit,
        totalBalance: budgetRecord.amount
      },
    },
    { upsert: true }
  );

  await Expense.updateMany(
    { user: userId, date: { $gte: start, $lte: end } },
    { $set: { counted: true } }
  );

  await syncUserStatsWithSummaries(userId);
  console.log(`  ✅ ${monthLabel} forced re-sync complete.`);
};

/**
 * The "Nuclear Option": Re-aggregates EVERY month since the start of time for a user.
 * Rebuilds all MonthlySummary records from raw Transaction data.
 */
export const rebuildAllSummaries = async (userId) => {
  const earliestExpense = await Expense.findOne({ user: userId }).sort({ date: 1 });
  if (!earliestExpense) return;

  const now = new Date();
  const startDate = new Date(earliestExpense.date);
  let tempDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  console.log(`🚀 Starting Global Rebuild for user ${userId}...`);

  while (tempDate <= now) {
    const monthLabel = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;

    const start = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
    const end = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0, 23, 59, 59);

    const monthExpenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lte: end }
    });

    const totals = monthExpenses.reduce((acc, exp) => {
      if (exp.type === "debit") acc.debit += exp.amount;
      else acc.credit += exp.amount;
      return acc;
    }, { debit: 0, credit: 0 });

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(userId);
    const Budget = (await import("../models/Budget.js")).default;
    let budgetRecord = await Budget.findOne({ user: userId, month: monthLabel });
    if (!budgetRecord) {
      budgetRecord = await Budget.create({ user: userId, month: monthLabel, amount: user.budget });
    }

    const MonthlySummary = (await import("../models/MonthlySummary.js")).default;
    await MonthlySummary.findOneAndUpdate(
      { user: userId, month: monthLabel },
      {
        $set: {
          totalDebit: Number(totals.debit.toFixed(2)),
          totalCredit: Number(totals.credit.toFixed(2)),
          totalBalance: budgetRecord.amount
        },
      },
      { upsert: true }
    );

    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  // After rebuilding all months, fix the lifetime stats
  await syncUserStatsWithSummaries(userId);

  // Mark ALL as counted now that summaries are perfect
  await Expense.updateMany({ user: userId }, { $set: { counted: true } });

  console.log(`✨ Global Rebuild Complete.`);
};
