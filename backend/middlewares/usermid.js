import jwt from "jsonwebtoken";
import config from "../config";


 function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startWith("Bearer")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token,config.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "invalid token or expired" });
    console.log("invalid token or expired" + error);
  }
}

export default userMiddleware;
