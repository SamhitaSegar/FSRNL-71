import express from "express";
import upload from "../config/multer.config.js";
import addMenuItem from "../controllers/admincontroller/addMenuItem.controller.js";
import deleteMenuItem from "../controllers/admincontroller/deleteMenuItem.controller.js";
import updateMenuItem from "../controllers/admincontroller/updateMenuItem.controller.js";
import isKitchenOwner from "../middleware/isKitchenOwner.middle.js";
import verificationToken from "../middleware/verifyToken.middle.js";
import { validateMenuItem } from "../validators/menu.validator.js";

const menuRoute = express.Router();

// all menu management routes are protected
menuRoute.use(verificationToken);

// add a menu item to a kitchen the user owns
menuRoute.post(
  "/:kitchenId",
  isKitchenOwner,
  upload.single("image"),
  validateMenuItem,
  addMenuItem,
);

// update / delete a specific menu item (ownership checked inside controller)
menuRoute.put("/:menuId", upload.single("image"), updateMenuItem);
menuRoute.delete("/:menuId", deleteMenuItem);

export default menuRoute;
