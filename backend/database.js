import mysql from "mysql";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});