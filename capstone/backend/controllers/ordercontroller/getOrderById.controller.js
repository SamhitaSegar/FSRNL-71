import Order from "../../models/order.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("kitchen", "name image address")
    .populate("items.menuItem", "name price image");

  if (!order) throw new ApiError(404, "order not found");

  if (order.user.toString() !== req.user.id)
    throw new ApiError(403, "access denied. this is not your order");

  res.status(200).json({
    order,
  });
});

export default getOrderById;
