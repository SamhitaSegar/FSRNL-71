import { rateLimit } from "express-rate-limit";

const message = {
  success: false,
  message: "too many request from this IP.. please try after given time",
};

export const allUserLimitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1,
  message: message,
});

export const singleUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: message,
});