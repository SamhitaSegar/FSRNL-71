import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import Kitchen from "../../models/kitchen.model.js";
import uploadImage from "../../utils/uploadImage.utils.js";

const createKitchen = asyncHandler(async (req, res) => {
  const {
    name,

    description,
    cuisine,
    street,
    city,
    state,
    pincode,
    deliveryTime,
    deliveryCharge,
  } = req.body;

  if (!name || !street || !pincode)
    throw new ApiError(400, "name and address fields are must");

  //check point for kitchen....
  const kitchenData = {
    name,
    owner: req.user.id,
    description: description || "this is description",
    cuisine: cuisine
      ? Array.isArray(cuisine)
        ? cuisine
        : cuisine.split(",").map((c) => c.trim())
      : [],
  };
  if (req.file) {
    const imageResult = await uploadImage(req.file.buffer, "kitchens");
    kitchenData.image = imageResult;
  }
  const kitchen = new Kitchen(kitchenData);
  await kitchen.save();

  res.status(201).json({
    message: "kitche created successfuly",
    kitchen,
  });
});

export default createKitchen;
