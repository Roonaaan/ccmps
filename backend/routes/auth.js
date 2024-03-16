import express from "express";
import { login, sendEmail } from "../controller/auth.js";

const router = express.Router();

// Route for user login
router.post("/login", login);

// Route for sending email
router.post("/send-email", sendEmail);

export default router;