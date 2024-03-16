import express from "express";
import { login, sendEmail, getUserProfile, getUserDetails } from "../controller/auth.js";

const router = express.Router();

// Route for user login
router.post("/login", login);

// Route for sending email
router.post("/send-email", sendEmail);

// Route for fetching user profile
router.get("/user-profile", getUserProfile);

// Route for getting user info
router.get("/user-details", getUserDetails);


export default router;