import User from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import bcrypt from "bcryptjs";

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    throw new ApiError(400, "all fields are required");
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "user already exist");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  await user.save();
  res.status(201).json({
    messsage: "user created successfuly",
    user,
  });
});
export default register;
