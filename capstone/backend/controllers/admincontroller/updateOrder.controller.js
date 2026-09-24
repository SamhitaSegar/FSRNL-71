import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";

const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

// PATCH /api/admin/orders/:orderId  (admin only)
// Update an order's orderStatus and/or paymentStatus.
const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  if (orderStatus && !ORDER_STATUSES.includes(orderStatus))
    throw new ApiError(400, "invalid order status");
  if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus))
    throw new ApiError(400, "invalid payment status");
  if (!orderStatus && !paymentStatus)
    throw new ApiError(400, "nothing to update");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "order not found");

  if (orderStatus) {
    order.orderStatus = orderStatus;
    // stamp delivery time when marked delivered
    if (orderStatus === "delivered") order.deliveredAt = new Date();
  }
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();

  res.status(200).json({
    message: "order updated successfuly",
    order,
  });
});

export default updateOrder;
