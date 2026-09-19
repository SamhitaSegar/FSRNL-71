import User from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import bcrypt from "bcryptjs";

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { username, email, password } = req.body;
  const updatedData = {};
  if (username) updatedData.username = username;
  if (email) updatedData.email = email;
  if (password) updatedData.password = await bcrypt.hash(password, 10);

  if (Object.keys(updatedData).length === 0) {
    throw new ApiError(400, "not given field to update");
  }
  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new ApiError(404, "user not found");

  res.status(200).json({
    message: "profle updated successfuly",
    user: updatedUser,
  });
});

export default updateProfile;
