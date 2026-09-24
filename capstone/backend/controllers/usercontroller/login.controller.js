import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "all fields are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "user does not exist");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new ApiError(403, "invalid password");

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  //mail firing....
  //notes
  //call the nodemailer sendmail function over here....
  res.status(200).json({
    message: "Login Successful",
    token,
  });
});

export default login;
