import express from "express";
import connectDB from "../config/db.config.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

//redis connection

const app=express()

app.use(helmet());

// CORS
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));

// Logger
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Cloud Kitchen API is running" });
});

//database connection...
connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is up and running",
  });
});
export default app;
