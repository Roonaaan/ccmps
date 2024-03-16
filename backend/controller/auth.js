import { db } from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the email exists in the database
      const [user] = await db.query('SELECT * FROM tblaccount WHERE ACCOUNT_EMAIL = ?', [email]);
  
      // If no user found with the given email
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.ACCOUNT_PASSWORD);
  
      // If passwords don't match
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // If email and password are correct, generate JWT token
      const token = jwt.sign({ userId: user.ACCOUNT_ID }, 'your_secret_key_here', { expiresIn: '1h' });
  
      // Send token to client
      res.json({ token });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };