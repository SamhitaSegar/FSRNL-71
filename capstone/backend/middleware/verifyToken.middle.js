import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "token is not availble" });
  }

  //bearer sdfghasdfg
  const tokenValue = token.split(" ")[1];

  try {
    const isVerified = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = isVerified;
    next();
  } catch (err) {
    res.status(401).json({ message: "invalid token" });
  }
};
export default verifyToken;
