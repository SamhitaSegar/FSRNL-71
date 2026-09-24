const validateMenuItem = (req, res, next) => {
  const { name, price, category, foodType } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (price === undefined || price < 0) {
    errors.push("Price must be a non-negative number");
  }

  const validCategories = ["veg", "non-veg", "egg", "vegan"];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(", ")}`);
  }

  const validFoodTypes = [
    "starter",
    "main-course",
    "dessert",
    "beverage",
    "snack",
    "thali",
  ];
  if (!foodType || !validFoodTypes.includes(foodType)) {
    errors.push(`Food type must be one of: ${validFoodTypes.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export { validateMenuItem };