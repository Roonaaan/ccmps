import express from "express";
import { login } from "../controller/auth.js"; // Added .js extension

const router = express.Router();

router.get("/find/:userId", login);

export default router;