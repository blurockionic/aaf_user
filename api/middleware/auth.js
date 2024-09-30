import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";

export const isAuthenticated = async (req, res, next) => {
  // extract token from cookie
  const { token } = req.cookies;

  //check token exist or not
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please Login!",
    });
  }

  //verify token
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  // check user exist or not
  req.user = await Auth.findById(decode._id);

  next();
};
