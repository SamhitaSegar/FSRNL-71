const validateOrder = (req, res, next) => {
  const { kitchenId, items, deliveryAddress, paymentMethod } = req.body;
  const errors = [];

  if (!kitchenId) {
    errors.push("Kitchen ID is required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push("At least one item is required");
  } else {
    items.forEach((item, index) => {
      if (!item.menuItem)
        errors.push(`Item ${index + 1}: menuItem ID is required`);
      if (!item.quantity || item.quantity < 1)
        errors.push(`Item ${index + 1}: quantity must be at least 1`);
    });
  }

  if (!deliveryAddress) {
    errors.push("Delivery address is required");
  } else {
    const { street, city, state, pincode, phone } = deliveryAddress;
    if (!street) errors.push("Street is required");
    if (!city) errors.push("City is required");
    if (!state) errors.push("State is required");
    if (!pincode) errors.push("Pincode is required");
    if (!phone) errors.push("Phone is required");
  }

  const validPaymentMethods = ["cod", "online", "upi"];
  if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
    errors.push(
      `Payment method must be one of: ${validPaymentMethods.join(", ")}`,
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export { validateOrder };