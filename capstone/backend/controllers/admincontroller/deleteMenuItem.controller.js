import Kitchen from "../../models/kitchen.model.js";
import Menu from "../../models/menu.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import deleteImage from "../../utils/deleteImage.utils.js";

const deleteMenuItem = asyncHandler(async (req, res) => {
  const { menuId } = req.params;

  const menuItem = await Menu.findById(menuId);
  if (!menuItem) throw new ApiError(404, "menu item not found");

  const kitchen = await Kitchen.findById(menuItem.kitchen);
  if (!kitchen) throw new ApiError(404, "kitchen not found");

  if (kitchen.owner.toString() !== req.user.id)
    throw new ApiError(403, "access denied. you don't own this kitchen");

  if (menuItem.image?.public_id) {
    await deleteImage(menuItem.image.public_id);
  }

  await menuItem.deleteOne();

  res.status(200).json({
    message: "menu item deleted successfuly",
  });
});

export default deleteMenuItem;
