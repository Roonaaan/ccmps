import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Increase payload size limit (e.g., 50mb)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

// Cookie parser middleware
app.use(cookieParser());

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Root URL route handler
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

// Start the server
app.listen(8800, () => {
    console.log("API working");
});