import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

const optionalProtect = async (req, res, next) => {
  let token = req.cookies?.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Just ignore failed tokens for optional routes.
      console.error("Optional auth token failed:", error.message);
    }
  }
  next();
};

export { protect, optionalProtect };
