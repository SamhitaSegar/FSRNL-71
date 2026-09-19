import crypto from "crypto";
import Order from "../../models/order.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !orderId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  )
    throw new ApiError(400, "all payment fields are required");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "order not found");

  if (order.user.toString() !== req.user.id)
    throw new ApiError(403, "access denied. this is not your order");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    order.paymentStatus = "failed";
    await order.save();
    throw new ApiError(400, "invalid payment signature");
  }

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  await order.save();

  res.status(200).json({
    message: "payment verified successfuly",
    order,
  });
});

export default verifyPayment;
