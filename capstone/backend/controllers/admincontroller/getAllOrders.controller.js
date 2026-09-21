import asyncHandler from "../../utils/asyncHandler.utils.js";
import Order from "../../models/order.model.js";

// GET /api/admin/orders  (admin only)
// Lists all orders across the platform.
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "username email")
    .populate("kitchen", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders,
  });
});

export default getAllOrders;
