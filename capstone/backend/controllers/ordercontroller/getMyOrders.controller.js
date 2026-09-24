import Order from "../../models/order.model.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("kitchen", "name image")
    .populate("items.menuItem", "name price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders,
  });
});

export default getMyOrders;
