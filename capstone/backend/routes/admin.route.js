import express from "express";
import deleteOrder from "../controllers/admincontroller/deleteOrder.controller.js";
import getAllOrders from "../controllers/admincontroller/getAllOrders.controller.js";
import getAllUsers from "../controllers/admincontroller/getAllUsers.controller.js";
import getStats from "../controllers/admincontroller/getStats.controller.js";
import updateOrder from "../controllers/admincontroller/updateOrder.controller.js";
import isAdmin from "../middleware/isAdmin.middle.js";
import verificationToken from "../middleware/verifyToken.middle.js";
import kitchenRoute from "./kitchen.route.js";
import menuRoute from "./menu.route.js";

const adminRoute = express.Router();

// Platform admin data + order management (require an authenticated admin).
const adminOnly = [verificationToken, isAdmin];

adminRoute.get("/stats", adminOnly, getStats);
adminRoute.get("/users", adminOnly, getAllUsers);
adminRoute.get("/orders", adminOnly, getAllOrders);
adminRoute.patch("/orders/:orderId", adminOnly, updateOrder);
adminRoute.delete("/orders/:orderId", adminOnly, deleteOrder);

// aggregates the kitchen and menu management APIs.
// each sub-router applies its own auth (verifyToken) and
// ownership checks (isKitchenOwner), so no extra guard here.
adminRoute.use("/kitchens", kitchenRoute);
adminRoute.use("/menu", menuRoute);

export default adminRoute;
