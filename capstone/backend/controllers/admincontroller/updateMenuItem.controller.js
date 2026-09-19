import Kitchen from "../../models/kitchen.model.js";
import Menu from "../../models/menu.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import deleteImage from "../../utils/deleteImage.utils.js";
import uploadImage from "../../utils/uploadImage.utils.js";

const updateMenuItem = asyncHandler(async (req, res) => {
  const { menuId } = req.params;
  const { name, description, price, category, foodType, isAvailable } =
    req.body;

  const menuItem = await Menu.findById(menuId);
  if (!menuItem) throw new ApiError(404, "menu item not found");

  const kitchen = await Kitchen.findById(menuItem.kitchen);
  if (!kitchen) throw new ApiError(404, "kitchen not found");

  if (kitchen.owner.toString() !== req.user.id)
    throw new ApiError(403, "access denied. you don't own this kitchen");

  const updatedData = {};
  if (name) updatedData.name = name;
  if (description !== undefined) updatedData.description = description;
  if (price !== undefined) updatedData.price = price;
  if (category) updatedData.category = category;
  if (foodType) updatedData.foodType = foodType;
  if (isAvailable !== undefined) updatedData.isAvailable = isAvailable;

  if (req.file) {
    if (menuItem.image?.public_id) {
      await deleteImage(menuItem.image.public_id);
    }
    const imageResult = await uploadImage(req.file.buffer, "menu");
    updatedData.image = imageResult;
  }

  if (Object.keys(updatedData).length === 0)
    throw new ApiError(400, "not given field to update");

  const updatedMenuItem = await Menu.findByIdAndUpdate(menuId, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "menu item updated successfuly",
    menuItem: updatedMenuItem,
  });
});

export default updateMenuItem;
