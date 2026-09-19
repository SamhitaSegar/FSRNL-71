import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import swaggerSpec from "../config/swagger.config.js";
import adminRoute from "../routes/admin.route.js";
import authRoute from "../routes/auth.route.js";
import kitchenRoute from "../routes/kitchen.route.js";
import menuRoute from "../routes/menu.route.js";
import orderRoute from "../routes/order.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// public/dist lives one level up from src/
const distPath = path.join(__dirname, "..", "public", "dist");

const app = express();
app.use(
  helmet({
    // allow the SPA and swagger UI assets to load without CSP conflicts
    contentSecurityPolicy: false,
  }),
);
// CORS
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
// Logger
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Cloud Kitchen API is running" });
});

// API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/kitchens", kitchenRoute);
app.use("/api/menu", menuRoute);
app.use("/api/orders", orderRoute);

// Serve the built frontend (public/dist) as static assets
app.use(express.static(distPath));

// SPA fallback + API 404. Pathless middleware (Express 5 safe):
// - unknown /api/* requests return JSON 404
// - everything else serves the SPA's index.html so client-side
//   routing works on deep links / page refreshes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, message: "route not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

// global error handler (handles ApiError thrown from controllers)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "something went wrong",
    errors: err.errors || [],
  });
});

export default app;
