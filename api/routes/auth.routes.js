import express from "express";
import { getProfile, login, logout, registration, updateDetails, verifyEmail } from "../controllers/auth.controller.js";


const router = express.Router();

//login routes
router.post("/login", login)

//sign up route
router.post("/signup", registration)

//update details
router.put("/update", updateDetails)

// logout route 
router.get("/logout", logout)

router.get("/me/:id", getProfile)

// endpoint for verify email
router.post("/verify", verifyEmail)


export default router