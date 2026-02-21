// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  budget: { type: Number, default: 0 },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
  savings: {
    type: Number,
    default: 0,
  },
  deficit: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
