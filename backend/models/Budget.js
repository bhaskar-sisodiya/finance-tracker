// models/Budget.js
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        month: {
            type: String, // format: YYYY-MM
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

// Ensure a user can only have one budget per month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);
