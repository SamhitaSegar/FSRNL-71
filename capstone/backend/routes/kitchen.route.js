import express from "express";
import upload from "../config/multer.config.js";
import createKitchen from "../controllers/admincontroller/createKitchen.controller.js";
import getKitchenOrders from "../controllers/admincontroller/getKitchenOrders.controller.js";
import getMyKitchen from "../controllers/admincontroller/getMyKitchen.controller.js";
import isKitchenOwner from "../middleware/isKitchenOwner.middle.js";
import verificationToken from "../middleware/verifyToken.middle.js";

const kitchenRoute = express.Router();

// all kitchen routes are protected
kitchenRoute.use(verificationToken);

kitchenRoute.post("/", upload.single("image"), createKitchen);
kitchenRoute.get("/my", getMyKitchen);

// owner-only routes for a specific kitchen
kitchenRoute.get("/:kitchenId/orders", isKitchenOwner, getKitchenOrders);

export default kitchenRoute;
