import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        return new Error("Redis: maximum retries exceeded");
      }
      return Math.min(retries * 50, 200);
    },
  },
});

redisClient.on("connect", () => {
  console.log("redis has connected");
});

redisClient.on("error", (err) => {
  console.log("error while connecting to redis", err.message);
});

try {
  await redisClient.connect();
} catch (err) {
  console.log(err);
}
export default redisClient;
