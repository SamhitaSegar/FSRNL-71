import express from "express";
import kitchenRoute from "./kitchen.route.js";
import menuRoute from "./menu.route.js";

const adminRoute = express.Router();

// aggregates the kitchen and menu management APIs.
// each sub-router applies its own auth (verifyToken) and
// ownership checks (isKitchenOwner), so no extra guard here.
adminRoute.use("/kitchens", kitchenRoute);
adminRoute.use("/menu", menuRoute);

export default adminRoute;
