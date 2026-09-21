import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";

// DELETE /api/admin/orders/:orderId  (admin only)
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "order not found");

  await order.deleteOne();

  res.status(200).json({
    message: "order deleted successfuly",
  });
});

export default deleteOrder;
