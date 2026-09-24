import Kitchen from "../../models/kitchen.model.js";
import Menu from "../../models/menu.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import uploadImage from "../../utils/uploadImage.utils.js";

const addMenuItem = asyncHandler(async (req, res) => {
  const { kitchenId } = req.params;
  const { name, description, price, category, foodType } = req.body;

  if (!name || !price || !category || !foodType)
    throw new ApiError(400, "name, price, category and foodType are required");

  const kitchen = await Kitchen.findById(kitchenId);
  if (!kitchen) throw new ApiError(404, "kitchen not found");

  if (kitchen.owner.toString() !== req.user.id)
    throw new ApiError(403, "access denied. you don't own this kitchen");

  const menuData = {
    name,
    description: description || "",
    price,
    category,
    foodType,
    kitchen: kitchenId,
  };

  if (req.file) {
    const imageResult = await uploadImage(req.file.buffer, "menu");
    menuData.image = imageResult;
  }

  const menuItem = new Menu(menuData);
  await menuItem.save();

  res.status(201).json({
    message: "menu item added successfuly",
    menuItem,
  });
});

export default addMenuItem;
