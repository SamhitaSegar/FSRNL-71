import asyncHandler from "../../utils/asyncHandler.utils.js";
import Kitchen from "../../models/kitchen.model.js";

// GET /api/browse/kitchens
// Public list of kitchens for customers to browse.
const getAllKitchens = asyncHandler(async (req, res) => {
  const kitchens = await Kitchen.find({ isOpen: true }).sort({ createdAt: -1 });
  res.status(200).json({
    count: kitchens.length,
    kitchens,
  });
});

export default getAllKitchens;
