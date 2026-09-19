import Kitchen from "../../models/kitchen.model.js";
import Order from "../../models/order.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const getKitchenOrders = asyncHandler(async (req, res) => {
  const { kitchenId } = req.params;

  const kitchen = await Kitchen.findById(kitchenId);
  if (!kitchen) throw new ApiError(404, "kitchen not found");

  if (kitchen.owner.toString() !== req.user.id)
    throw new ApiError(403, "access denied. you don't own this kitchen");

  const orders = await Order.find({ kitchen: kitchenId })
    .populate("user", "username email")
    .populate("items.menuItem", "name price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders,
  });
});

export default getKitchenOrders;
