import razorpay from "../../config/razorpay.config.js";
import Kitchen from "../../models/kitchen.model.js";
import Menu from "../../models/menu.model.js";
import Order from "../../models/order.model.js";
import ApiError from "../../utils/ApiError.utils.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";

const placeOrder = asyncHandler(async (req, res) => {
  const { kitchenId, items, deliveryAddress, paymentMethod } = req.body;

  if (!kitchenId || !items || !Array.isArray(items) || items.length === 0)
    throw new ApiError(400, "kitchenId and items are required");

  if (
    !deliveryAddress ||
    !deliveryAddress.street ||
    !deliveryAddress.city ||
    !deliveryAddress.state ||
    !deliveryAddress.pincode ||
    !deliveryAddress.phone
  )
    throw new ApiError(400, "complete delivery address is required");

  const kitchen = await Kitchen.findById(kitchenId);
  if (!kitchen) throw new ApiError(404, "kitchen not found");
  if (!kitchen.isOpen) throw new ApiError(400, "kitchen is currently closed");

  // build order items from DB to prevent client-side price tampering
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const menuItem = await Menu.findById(item.menuItem);
    if (!menuItem)
      throw new ApiError(404, `menu item ${item.menuItem} not found`);

    if (menuItem.kitchen.toString() !== kitchenId)
      throw new ApiError(400, "all items must belong to the same kitchen");

    if (!menuItem.isAvailable)
      throw new ApiError(400, `${menuItem.name} is not available`);

    const quantity = Number(item.quantity) || 1;
    if (quantity < 1) throw new ApiError(400, "quantity must be at least 1");

    subtotal += menuItem.price * quantity;
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    });
  }

  const deliveryCharge = kitchen.deliveryCharge || 0;
  const totalAmount = subtotal + deliveryCharge;

  const orderData = {
    user: req.user.id,
    kitchen: kitchenId,
    items: orderItems,
    deliveryAddress,
    subtotal,
    deliveryCharge,
    totalAmount,
    paymentMethod: paymentMethod || "cod",
  };

  const order = new Order(orderData);

  // for online/upi payments, create a razorpay order for the client to pay
  let razorpayOrder = null;
  if (order.paymentMethod === "online" || order.paymentMethod === "upi") {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      receipt: order._id.toString(),
    });
  }

  await order.save();

  res.status(201).json({
    message: "order placed successfuly",
    order,
    razorpayOrder,
  });
});

export default placeOrder;
