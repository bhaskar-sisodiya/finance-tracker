// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  domain: { type: String, required: true }, // e.g., 'Groceries', 'Transport'
  title: { type: String, required: true }, // Short name like 'Dinner at Swiggy'
  description: { type: String }, // Optional long note
  amount: { type: Number, required: true },
  type: { type: String, enum: ["debit", "credit"], required: true },
  counted: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Expense", expenseSchema);
