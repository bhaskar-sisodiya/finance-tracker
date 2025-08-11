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

    res.status(200).json({
      message: "Profile updated",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        profilePic: updatedUser.profilePic,
        budget: updatedUser.budget,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error while updating profile" });
  }
};