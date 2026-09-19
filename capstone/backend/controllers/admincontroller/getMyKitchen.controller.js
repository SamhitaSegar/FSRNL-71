import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import Kitchen from "../../models/kitchen.model.js";

const getMyKitchen = asyncHandler(async (req, res) => {
  const kitchens = await Kitchen.find({
    owner: req.user.id,
  }).sort({
    createdAt: -1,
  });
  if (!kitchens) throw new ApiError(404, "no kitchen found");
  res.status(200).json({
    kitchens,
  });
});
export default getMyKitchen;
