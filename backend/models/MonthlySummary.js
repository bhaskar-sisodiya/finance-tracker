// models/MonthlySummary.js
import mongoose from "mongoose";

const monthlySummarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  month: { type: String, required: true }, // e.g. "2025-06"
  totalBalance: Number,       // from user.budget at month end
  totalDebit: Number,         // sum of debit expenses
  totalCredit: Number,        // sum of credit entries
  deficit: Number             // optional, still useful
}, { timestamps: true });

export default mongoose.model("MonthlySummary", monthlySummarySchema);