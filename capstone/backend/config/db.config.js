import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();


//TODO=> add a retry method 5 times each on the gap of 5 second....
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to mongoDB");
}
export default connectDB;
