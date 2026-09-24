import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";

// GET /api/admin/users  (admin only)
// Lists all users without password hashes.
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({
    count: users.length,
    users,
  });
});

export default getAllUsers;
