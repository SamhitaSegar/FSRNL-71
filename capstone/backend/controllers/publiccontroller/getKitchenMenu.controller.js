import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Kitchen from "../../models/kitchen.model.js";
import Menu from "../../models/menu.model.js";

// GET /api/browse/kitchens/:kitchenId/menu
// Public list of available menu items for a kitchen.
const getKitchenMenu = asyncHandler(async (req, res) => {
  const { kitchenId } = req.params;

  const kitchen = await Kitchen.findById(kitchenId);
  if (!kitchen) throw new ApiError(404, "kitchen not found");

  const menu = await Menu.find({
    kitchen: kitchenId,
    isAvailable: true,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    count: menu.length,
    kitchen,
    menu,
  });
});

export default getKitchenMenu;
