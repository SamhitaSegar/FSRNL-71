import express from "express";
import getAllKitchens from "../controllers/publiccontroller/getAllKitchens.controller.js";
import getKitchenMenu from "../controllers/publiccontroller/getKitchenMenu.controller.js";

// Public browsing routes (no auth required).
const browseRoute = express.Router();

browseRoute.get("/kitchens", getAllKitchens);
browseRoute.get("/kitchens/:kitchenId/menu", getKitchenMenu);

export default browseRoute;
