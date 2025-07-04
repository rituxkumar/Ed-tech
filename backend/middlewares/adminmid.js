import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
  // console.log(config.JWT_USER_PASSWORD);
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ errors: "No token provided..." });
  }

  const token = authHeader.split(" ")[1];
  try {
    console.log(process.env.JWT_ADMIN_PASSWORD);
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);

    console.log("decoded");
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ errors: "invalid token or expired" });
    // console.log("invalid token or expired" + error);
  }
}

export default adminMiddleware;