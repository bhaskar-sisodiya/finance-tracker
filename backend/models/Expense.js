// models/Expense.js
import mongoose from "mongoose";

const DEBIT_DOMAINS = [
  "Housing & Utilities",
  "Food & Groceries",
  "Transportation",
  "Healthcare",
  "Education & Learning",
  "Work & Professional",
  "Savings & Investments",
  "Entertainment & Leisure",
  "Personal Care",
  "Family & Social",
  "Taxes & Legal",
  "Miscellaneous",
];

const CREDIT_DOMAINS = [
  "Salary & Wages",
  "Business & Self-Employment",
  "Investments & Capital Gains",
  "Real Estate & Property",
  "Government & Institutional Transfers",
  "Family & Personal Transfers",
  "Royalties & Intellectual Property",
  "Digital & Online Sources",
  "Windfalls & Miscellaneous",
];

const ALL_DOMAINS = [...DEBIT_DOMAINS, ...CREDIT_DOMAINS];

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  domain: {
    type: String,
    required: true,
    enum: {
      values: ALL_DOMAINS,
      message: "'{VALUE}' is not a valid expense domain.",
    },
  },
  title: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["debit", "credit"], required: true },
  counted: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Expense", expenseSchema);
