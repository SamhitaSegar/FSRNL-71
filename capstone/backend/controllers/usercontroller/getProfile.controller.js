import User from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new ApiError(404, "user not found");
  res.status(200).json({
    message: "user fetched successfuly",
    user,
  });
});
export default getProfile;
