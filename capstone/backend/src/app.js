import express from "express";
import connectDB from "../config/db.config.js";

//redis connection

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection...
connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is up and running",
  });
});
export default app;
