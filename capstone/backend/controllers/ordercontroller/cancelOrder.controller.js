import Order from "../../models/order.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { cancelReason } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "order not found");

  if (order.user.toString() !== req.user.id)
    throw new ApiError(403, "access denied. this is not your order");

  if (order.orderStatus === "cancelled")
    throw new ApiError(400, "order is already cancelled");

  if (["out_for_delivery", "delivered"].includes(order.orderStatus))
    throw new ApiError(400, "order can no longer be cancelled");

  order.orderStatus = "cancelled";
  order.cancelReason = cancelReason || "cancelled by user";

  if (order.paymentStatus === "paid") {
    order.paymentStatus = "refunded";
  }

  await order.save();

  res.status(200).json({
    message: "order cancelled successfuly",
    order,
  });
});

export default cancelOrder;
